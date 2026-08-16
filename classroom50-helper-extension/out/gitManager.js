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
exports.GitManager = void 0;
const vscode = __importStar(require("vscode"));
const child_process_1 = require("child_process");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
class GitManager {
    static getGitExtension() {
        const vscodeGit = vscode.extensions.getExtension('vscode.git');
        return vscodeGit ? vscodeGit.exports : null;
    }
    static async getRepository() {
        const gitExtension = this.getGitExtension();
        if (!gitExtension) {
            vscode.window.showErrorMessage('Git extension is not active or installed.');
            return null;
        }
        const api = gitExtension.getAPI(1);
        if (api.repositories.length === 0) {
            vscode.window.showErrorMessage('No active Git repository found in the workspace.');
            return null;
        }
        return api.repositories[0];
    }
    static runCommand(workspaceDir, cmd) {
        return new Promise((resolve, reject) => {
            (0, child_process_1.exec)(cmd, { cwd: workspaceDir }, (error, stdout, stderr) => {
                if (error) {
                    reject(stderr || error.message);
                }
                else {
                    resolve(stdout.trim());
                }
            });
        });
    }
    static runGitCommand(workspaceDir, args) {
        return this.runCommand(workspaceDir, `git ${args}`);
    }
    static parseClassroomConfig(workspaceDir) {
        const configPath = path.join(workspaceDir, '.classroom50.yaml');
        if (!fs.existsSync(configPath)) {
            return null;
        }
        try {
            const content = fs.readFileSync(configPath, 'utf8');
            const config = {};
            const classroomMatch = content.match(/classroom:\s*["']?([^"'\r\n]+)["']?/);
            if (classroomMatch) {
                config.classroom = classroomMatch[1];
            }
            const assignmentMatch = content.match(/assignment:\s*["']?([^"'\r\n]+)["']?/);
            if (assignmentMatch) {
                config.assignment = assignmentMatch[1];
            }
            // Parse source block
            const sourceMatch = content.match(/source:\s*[\r\n]+(?:\s+.*\r?[\n]*)+/);
            if (sourceMatch) {
                config.source = {};
                const sourceBlock = sourceMatch[0];
                const ownerMatch = sourceBlock.match(/owner:\s*["']?([^"'\r\n]+)["']?/);
                if (ownerMatch) {
                    config.source.owner = ownerMatch[1];
                }
                const repoMatch = sourceBlock.match(/repo:\s*["']?([^"'\r\n]+)["']?/);
                if (repoMatch) {
                    config.source.repo = repoMatch[1];
                }
                const branchMatch = sourceBlock.match(/branch:\s*["']?([^"'\r\n]+)["']?/);
                if (branchMatch) {
                    config.source.branch = branchMatch[1];
                }
            }
            return config;
        }
        catch {
            return null;
        }
    }
    static async isGhStudentInstalled(workspaceDir) {
        try {
            await this.runCommand(workspaceDir, 'gh student --help');
            return true;
        }
        catch {
            return false;
        }
    }
    static async syncTemplates() {
        const repo = await this.getRepository();
        if (!repo) {
            return;
        }
        const workspaceDir = repo.rootUri.fsPath;
        let templateRemoteUrl = '';
        // 1. Try reading from .classroom50.yaml
        const classroomConfig = this.parseClassroomConfig(workspaceDir);
        if (classroomConfig && classroomConfig.source && classroomConfig.source.owner && classroomConfig.source.repo) {
            const { owner, repo } = classroomConfig.source;
            templateRemoteUrl = `https://github.com/${owner}/${repo}.git`;
        }
        // 2. Fallback to settings or user prompt
        if (!templateRemoteUrl) {
            const config = vscode.workspace.getConfiguration('classroom50');
            templateRemoteUrl = config.get('templateRemoteUrl') || '';
            if (!templateRemoteUrl) {
                templateRemoteUrl = await vscode.window.showInputBox({
                    prompt: 'Please enter the URL of the central template repository to sync from:',
                    placeHolder: 'https://github.com/organization/assignment-template.git',
                    ignoreFocusOut: true
                }) || '';
                if (!templateRemoteUrl) {
                    vscode.window.showWarningMessage('Template Sync canceled: No URL provided.');
                    return;
                }
                await config.update('templateRemoteUrl', templateRemoteUrl, vscode.ConfigurationTarget.Workspace);
            }
        }
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "Syncing Lab Templates...",
            cancellable: false
        }, async (progress) => {
            try {
                // Add upstream remote if not exists
                progress.report({ message: "Checking remotes..." });
                const remotesList = await this.runGitCommand(workspaceDir, 'remote');
                const remotes = remotesList.split(/\s+/);
                if (!remotes.includes('upstream')) {
                    progress.report({ message: "Adding upstream remote..." });
                    await this.runGitCommand(workspaceDir, `remote add upstream "${templateRemoteUrl}"`);
                }
                // Fetch template updates
                progress.report({ message: "Fetching latest templates..." });
                await this.runGitCommand(workspaceDir, 'fetch upstream');
                // Merge template updates into current branch
                progress.report({ message: "Merging updates..." });
                try {
                    const branchName = classroomConfig?.source?.branch || 'main';
                    await this.runGitCommand(workspaceDir, `merge upstream/${branchName} --allow-unrelated-histories --no-edit`);
                    vscode.window.showInformationMessage('Successfully synced with central template repository!');
                }
                catch (mergeError) {
                    // Handle conflicts
                    vscode.window.showWarningMessage('Merge conflict detected while syncing templates. Please check the source control tab to resolve conflicts.', 'View Conflicts').then(selection => {
                        if (selection === 'View Conflicts') {
                            vscode.commands.executeCommand('workbench.view.scm');
                        }
                    });
                }
            }
            catch (err) {
                vscode.window.showErrorMessage(`Sync failed: ${err.message || err}`);
            }
        });
    }
    static async submitTask(labName, taskName) {
        const repo = await this.getRepository();
        if (!repo) {
            return;
        }
        const workspaceDir = repo.rootUri.fsPath;
        const configExists = fs.existsSync(path.join(workspaceDir, '.classroom50.yaml'));
        const hasGhStudent = await this.isGhStudentInstalled(workspaceDir);
        // Standard Classroom 50 submission flow
        if (configExists && hasGhStudent) {
            await vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: `Submitting via Classroom 50...`,
                cancellable: false
            }, async (progress) => {
                try {
                    progress.report({ message: "Running gh student submit..." });
                    const stdout = await this.runCommand(workspaceDir, 'gh student submit');
                    // Parse output to find commit view link
                    const urlMatch = stdout.match(/https:\/\/github\.com\/[^\s]+/);
                    if (urlMatch) {
                        const url = urlMatch[0];
                        vscode.window.showInformationMessage(`Successfully submitted ${labName} ${taskName}! Autograder triggered.`, 'View Submission').then(selection => {
                            if (selection === 'View Submission') {
                                vscode.env.openExternal(vscode.Uri.parse(url));
                            }
                        });
                    }
                    else {
                        vscode.window.showInformationMessage(`Successfully submitted ${labName} ${taskName}! Autograder triggered.`);
                    }
                }
                catch (err) {
                    vscode.window.showErrorMessage(`Classroom 50 submission failed: ${err.message || err}`);
                }
            });
            return;
        }
        // Fallback flow: Manual Git staging & pushing
        const taskRelativePath = path.join('labs', labName, taskName);
        const commitMessage = `${labName} ${taskName}`;
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: `Submitting ${labName} ${taskName} (Manual Fallback)...`,
            cancellable: false
        }, async (progress) => {
            try {
                progress.report({ message: "Staging files..." });
                const stagePath = taskRelativePath.replace(/\\/g, '/');
                await this.runGitCommand(workspaceDir, `add "${stagePath}"`);
                // Check if there are staged changes to commit
                const status = await this.runGitCommand(workspaceDir, `status --porcelain`);
                const hasStagedChanges = status.split('\n').some(line => {
                    const code = line.trim().slice(0, 2);
                    return code.startsWith('A') || code.startsWith('M') || code.startsWith('D') || code.startsWith('R');
                });
                if (!hasStagedChanges) {
                    vscode.window.showInformationMessage('No changes found to submit for this task.');
                    return;
                }
                progress.report({ message: "Committing changes..." });
                await this.runGitCommand(workspaceDir, `commit -m "${commitMessage}"`);
                progress.report({ message: "Pushing to GitHub..." });
                const currentBranch = await this.runGitCommand(workspaceDir, 'rev-parse --abbrev-ref HEAD');
                await this.runGitCommand(workspaceDir, `push origin ${currentBranch}`);
                vscode.window.showInformationMessage(`Successfully submitted ${labName} ${taskName}!`);
            }
            catch (err) {
                vscode.window.showErrorMessage(`Submission failed: ${err.message || err}`);
            }
        });
    }
}
exports.GitManager = GitManager;
//# sourceMappingURL=gitManager.js.map