'use strict';

import * as vscode from 'vscode';
import * as utils from './utils';

export function activate(context: vscode.ExtensionContext) {

    let tools = new QuickOpenFileTools();
    let disposable = vscode.commands.registerCommand('extension.quickOpenFile', () => {
        tools.findFiles();
    });

    context.subscriptions.push(disposable);
}

/**
 * QuickOpenFileTools
 */
class QuickOpenFileTools {

    extensionInclude    = [];
    folderExclude       = [];
    suffixList          = [];
    autoCompleteSuffix  = true;

    public findFiles() {
        this.updateOption();

        let word = utils.getCurrentWord();
        let searchKey = '**/' + word + '.*';
        if (this.autoCompleteSuffix) {
            searchKey = '**/' + word + '*';
        }
        vscode.workspace.findFiles(searchKey, '', 100)
            .then(files=>{
                let validFiles = this.getValidFiles(files, word);
                this.showResult(validFiles);
            });
    }

    private updateOption() {
        let configuration       = vscode.workspace.getConfiguration('quickOpenFile');
        this.extensionInclude   = <string[]>configuration.get('extensionInclude');
        this.folderExclude      = <string[]>configuration.get('folderExclude');
        this.suffixList         = <string[]>configuration.get('suffixList');
        this.autoCompleteSuffix = <boolean> configuration.get('autoCompleteSuffix');
    }

    private showResult(files : string[]) {
        let window = vscode.window;
        let workspace = vscode.workspace;

        let length = files.length;
        if (length <= 0) {
            window.showWarningMessage("File is not exist.");
        } else if (length == 1) {
            this.openFile(files[0]);
        } else {
            window.showQuickPick(files).then((file) => {
                this.openFile(file);
            });
        }
    }

    private openFile(filePath : string) {
        if (!filePath) return;
        vscode.workspace.openTextDocument(filePath).then(txtDocument=>vscode.window.showTextDocument(txtDocument));
    }

    private getValidFiles(files : vscode.Uri[], word : string) : string[] {
        let vaildFileArray = [];
        files.forEach(file => {
            let filePath = file.fsPath;
            
            if (this.isValidExtension(filePath) && this.isValidFolder(filePath) && this.isValidSuffix(filePath, word)) {
                vaildFileArray.push(filePath);
            }
        });
        return vaildFileArray;
    }

    private isValidExtension(filePath : string) : boolean {
        if (this.extensionInclude.length == 1 && this.extensionInclude[0] == '*') {
            return true;
        }
        let extension = utils.getFileExtension(filePath);
        let index = this.extensionInclude.indexOf(extension);
        return index != -1;
    }

    private isValidSuffix(filePath : string, word : string) : boolean {
        if (!this.autoCompleteSuffix) {
            return true;
        }
        if (this.suffixList.length == 1 && this.suffixList[0] == '*') {
            return true;
        }
        let fileName = utils.getFileNameNoExtension(filePath);
        let suffix = fileName.substring(word.length, fileName.length);
        if (suffix.length <= 0) {
            return true;
        }
        let index = this.suffixList.indexOf(suffix);
        return index != -1;
    }

    private isValidFolder(filePath : string) : boolean {
        if (this.folderExclude.length <= 0) {
            return true;
        }
        let relativeFolderName = utils.getRelativeFolderName(filePath);
        relativeFolderName = relativeFolderName.replace(/\\/g, '/');
        if (relativeFolderName.startsWith('/')) {
            relativeFolderName = relativeFolderName.substring(1, relativeFolderName.length);
        }
        let index = this.folderExclude.indexOf(relativeFolderName);
        return index == -1;
    }
}

