'use strict';

import * as vscode from 'vscode';
import * as utils from './utils';
import FilesCache from './filesCache';
import PeekFileDefinitionProvider from './peekFileDefinitionProvider';

export function activate(context: vscode.ExtensionContext) {
    let quickOpenFile = vscode.commands.registerCommand('extension.quickOpenFile', () => {
        let word = utils.getCurrentWord();
        let uries = FilesCache.GetInstance().searchFile(word);
        let length = uries.length;
        if (length <= 0) {
            vscode.window.showWarningMessage("Target file is not found, please ensure extension settings is correct.");
        } else if (length == 1) {
            utils.openFile(uries[0].fsPath);
        } else {
            utils.showFileQuickPick(uries);
        }
    });

    let peekLanguages = <string[]>vscode.workspace.getConfiguration('quickOpenFile').get('peekLanguages');
    const peek_filter: vscode.DocumentFilter[] = peekLanguages.map((language) => {
        return {
            language: language,
            scheme: 'file'
        };
    });
    let definitionProvider = vscode.languages.registerDefinitionProvider(peek_filter, new PeekFileDefinitionProvider());
    context.subscriptions.push(quickOpenFile);
    context.subscriptions.push(definitionProvider);
}

export function deactivate() {
}
