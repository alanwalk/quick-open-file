'use strict';

import * as vscode from 'vscode';
import QuickOpenFileTools from './quickOpenFileTools';

export function activate(context: vscode.ExtensionContext) {
    let tools = new QuickOpenFileTools();
    let disposable = vscode.commands.registerCommand('extension.quickOpenFile', () => {
        tools.findFiles();
    });
    context.subscriptions.push(disposable);
}

export function deactivate() {
}
