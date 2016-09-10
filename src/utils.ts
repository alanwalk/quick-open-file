'use strict'

import * as vscode from 'vscode';

export function openFile(path : string) {
    if (path == vscode.window.activeTextEditor.document.fileName) {
        vscode.window.showInformationMessage("Target is current file.");
        return;
    }
    vscode.workspace.openTextDocument(path)
    .then(txtDocument=>vscode.window.showTextDocument(txtDocument));
}

export function getCurrentWord() : string {
    let window = vscode.window;
    let editor = window.activeTextEditor;
    let document = editor.document;

    let wordRange = document.getWordRangeAtPosition(editor.selection.start);
    return document.getText(wordRange);
}

export function getFileName(path : string) : string {
    return path.substring(path.lastIndexOf('/') + 1);
}

export function getFileExtension(path : string) : string {
    return path.substring(path.lastIndexOf('.') + 1);
}

export function getFileNameNoExtension(path : string) : string {
    let lastSplitIndex = path.lastIndexOf('/');
    let lastDotIndex = path.lastIndexOf('.');
    return path.substring(lastSplitIndex + 1, lastDotIndex);
}

export function getFileQuickPickItem(uri : vscode.Uri) {
    let path = uri.path
    return {
        detail: vscode.workspace.asRelativePath(path),
        label : getFileName(path),
        path  :path
    };
}

export function getFileQuickPickList(uries : vscode.Uri[]) {
    let quickPickList = []
    uries.forEach(uri => {
        quickPickList.push(getFileQuickPickItem(uri));
    });
    return quickPickList;
}

export function showFileQuickPick(uries : vscode.Uri[]) {
    vscode.window.showQuickPick(getFileQuickPickList(uries),{ matchOnDetail:true })
    .then(file => {
        if(file && file.path) openFile(file.path);
    });
}
