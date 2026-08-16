"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeRunner = void 0;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class CodeRunner {
    static getTerminal() {
        if (this.terminal && this.terminal.exitStatus === undefined) {
            return this.terminal;
        }
        // Dispose old terminal if it closed
        if (this.terminal) {
            this.terminal.dispose();
        }
        this.terminal = vscode.window.createTerminal("Classroom 50 Runner");
        return this.terminal;
    }
    static async runCode(labName, taskName) {
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
        let testbenches = [];
        try {
            testbenches = fs.readdirSync(tbFolderPath).filter(file => file.endsWith('.v') || file.endsWith('.sv'));
        }
        catch (err) {
            vscode.window.showErrorMessage(`Failed to read testbenches: ${err.message}`);
            return;
        }
        if (testbenches.length === 0) {
            vscode.window.showErrorMessage(`No testbenches (*.v) found in: ${tbFolderPath}`);
            return;
        }
        // If there is only one testbench, run it automatically. Otherwise, ask the user.
        let selectedTb;
        if (testbenches.length === 1) {
            selectedTb = testbenches[0];
        }
        else {
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
exports.CodeRunner = CodeRunner;
CodeRunner.terminal = null;
//# sourceMappingURL=codeRunner.js.map