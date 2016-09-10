'use strict'

import * as vscode from 'vscode';

/**
 * 打开文件
 */
export function openFile(path : string) {
    if (path == vscode.window.activeTextEditor.document.fileName) {
        vscode.window.showInformationMessage("Target is current file.");
        return;
    }
    vscode.workspace.openTextDocument(path)
    .then(txtDocument=>vscode.window.showTextDocument(txtDocument));
}

/**
 * 获取当前光标位置单词
 */
export function getCurrentWord() : string {
    let window = vscode.window;
    let editor = window.activeTextEditor;
    let document = editor.document;

    let wordRange = document.getWordRangeAtPosition(editor.selection.start);
    return document.getText(wordRange);
}

/**
 * 获取文件名
 */
export function getFileName(path : string) {
    return path.substring(path.lastIndexOf('/') + 1);
}

/**
 * 获取文件列表QuickPick的Item
 */
export function getFileQuickPickItem(uri : vscode.Uri) {
    let fsPath = uri.fsPath
    return {
        detail: vscode.workspace.asRelativePath(fsPath),
        label : getFileName(fsPath),
        path  :fsPath
    };
}

/**
 * 获取文件列表QuickPick的List
 */
export function getFileQuickPickList(uries : vscode.Uri[]) {
    let quickPickList = []
    uries.forEach(uri => {
        quickPickList.push(getFileQuickPickItem(uri));
    });
    return quickPickList;
}

/**
 * 显示文件列表QuickPick
 */
export function showFileQuickPick(uries : vscode.Uri[]) {
    vscode.window.showQuickPick(getFileQuickPickList(uries),{ matchOnDetail:true })
    .then(file => {
        if(file && file.path) openFile(file.path);
    });
}
