import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class CodeRunner {
    private static terminal: vscode.Terminal | null = null;

    private static getTerminal(): vscode.Terminal {
        if (this.terminal && (this.terminal as any).exitStatus === undefined) {
            return this.terminal;
        }
        // Dispose old terminal if it closed
        if (this.terminal) {
            this.terminal.dispose();
        }
        this.terminal = vscode.window.createTerminal("Classroom 50 Runner");
        return this.terminal;
    }

    public static async runCode(labName?: string, taskName?: string): Promise<void> {
        let activeLab = labName;
        let activeTask = taskName;

        // Auto-detect from active editor if not provided via tree view
        if (!activeLab || !activeTask) {
            const activeEditor = vscode.window.activeTextEditor;
            if (activeEditor) {
                const filePath = activeEditor.document.uri.fsPath;
                const relativePath = vscode.workspace.asRelativePath(filePath);
                
                // Expected path: labs/lab01/task0/dut.v
                const pathParts = relativePath.split(/[\\/]/);
                if (pathParts[0] === 'labs' && pathParts[1] && pathParts[2]) {
                    activeLab = pathParts[1];
                    activeTask = pathParts[2];
                }
            }
        }

        if (!activeLab || !activeTask) {
            vscode.window.showWarningMessage('Please open a Verilog design file inside a task folder or select a task from the sidebar.');
            return;
        }

        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            vscode.window.showErrorMessage('No workspace folder open.');
            return;
        }

        // Locate testbench folder: labs/<lab>/tb/
        const tbFolderPath = path.join(workspaceFolder.uri.fsPath, 'labs', activeLab, 'tb');
        if (!fs.existsSync(tbFolderPath)) {
            vscode.window.showErrorMessage(`Testbench folder not found at: ${tbFolderPath}`);
            return;
        }

        // Read all testbench files
        let testbenches: string[] = [];
        try {
            testbenches = fs.readdirSync(tbFolderPath).filter(file => file.endsWith('.v') || file.endsWith('.sv'));
        } catch (err: any) {
            vscode.window.showErrorMessage(`Failed to read testbenches: ${err.message}`);
            return;
        }

        if (testbenches.length === 0) {
            vscode.window.showErrorMessage(`No testbenches (*.v) found in: ${tbFolderPath}`);
            return;
        }

        // If there is only one testbench, run it automatically. Otherwise, ask the user.
        let selectedTb: string | undefined;
        if (testbenches.length === 1) {
            selectedTb = testbenches[0];
        } else {
            selectedTb = await vscode.window.showQuickPick(testbenches, {
                placeHolder: `Select testbench to verify ${activeLab} ${activeTask}:`,
                ignoreFocusOut: true
            });
        }

        if (!selectedTb) {
            vscode.window.showWarningMessage('Run canceled: No testbench selected.');
            return;
        }

        const terminal = this.getTerminal();
        terminal.show();

        // Under the hood commands for compilation and execution
        // We use unix-like paths since VS Code online codespaces run on Linux containers
        const compileCmd = `./scripts/compile.sh ${activeLab} ${activeTask} ${selectedTb}`;
        const runCmd = `./scripts/run.sh ${activeLab} ${activeTask} ${selectedTb}`;

        terminal.sendText(`${compileCmd} && ${runCmd}`);
    }
}
