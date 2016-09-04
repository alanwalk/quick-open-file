'use strict';

import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

    let disposable = vscode.commands.registerCommand('extension.quickOpenFile', () => {

        let range = vscode.window.activeTextEditor.document.getWordRangeAtPosition(vscode.window.activeTextEditor.selection.start);
        let text = vscode.window.activeTextEditor.document.getText(range);
        let inclue = '**/' + text + '*'
        // '**/Text*.txt'
        vscode.workspace.findFiles(inclue, '', 100)
            .then(uries=>{
                let length = uries.length
                if (length <= 0) {
                    vscode.window.showWarningMessage("No any file about it.");
                } else if (length == 1) {
                    vscode.workspace.openTextDocument(uries[0].fsPath).then(txtDocument=>vscode.window.showTextDocument(txtDocument));
                } else {
                    let pathArray = []
                    uries.forEach(url => {
                        pathArray.push(url.fsPath)
                    });
                    vscode.window.showQuickPick(pathArray).then((path) => {
                        if (path) {
                            vscode.workspace.openTextDocument(path).then(txtDocument=>vscode.window.showTextDocument(txtDocument));
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
