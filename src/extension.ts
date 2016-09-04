'use strict';

import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

    let disposable = vscode.commands.registerCommand('extension.quickOpenFile', () => {

        let workspace = vscode.workspace;
        let window = vscode.window;
        let editor = window.activeTextEditor;
        let document = editor.document;

        let configuration       = workspace.getConfiguration('quickOpenFile');
        let extensionInclude    = configuration.get('extensionInclude');
        let folderExclude       = configuration.get('folderExclude');
        let completeSuffixList  = configuration.get('completeSuffixList');
        let autoCompleteSuffix  = configuration.get('autoCompleteSuffix');

        let range = document.getWordRangeAtPosition(editor.selection.start);
        let text = document.getText(range);
        let inclue = '**/' + text + '*';

        workspace.findFiles(inclue, '', 100)
            .then(files=>{
                let length = files.length;
                if (length <= 0) {
                    window.showWarningMessage("No any file about it.");
                } else if (length == 1) {
                    workspace.openTextDocument(files[0].fsPath).then(txtDocument=>window.showTextDocument(txtDocument));
                } else {
                    let pathArray = []
                    files.forEach(file => {
                        pathArray.push(file.fsPath)
                    });
                    window.showQuickPick(pathArray).then((path) => {
                        if (path) {
                            workspace.openTextDocument(path).then(txtDocument=>window.showTextDocument(txtDocument));
                        }
                    });
                }
            });

    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}
