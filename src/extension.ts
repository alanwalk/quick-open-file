'use strict';

import * as vscode from 'vscode';
import QuickOpenFileTools from './quickOpenFileTools';
import PeekFileDefinitionProvider from './peekFileDefinitionProvider';

export function activate(context: vscode.ExtensionContext) {
    let tools = new QuickOpenFileTools();
    let quickOpenFile = vscode.commands.registerCommand('extension.quickOpenFile', () => {
        tools.findFiles();
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
