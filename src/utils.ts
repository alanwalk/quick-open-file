
import * as vscode from 'vscode';

export function openFile(filePath : string) {
    let workspace = vscode.workspace;
    let window = vscode.window;

    workspace.openTextDocument(filePath).then(txtDocument=>window.showTextDocument(txtDocument));
}

export function getAbsoluteFolderName(filePath : string) : string {
    let lastSplitIndex = filePath.lastIndexOf('\\');
    return filePath.substring(0, lastSplitIndex);
}

export function getRelativeFolderName(filePath : string) : string {
    let workspace = vscode.workspace;
    let relativePath = workspace.asRelativePath(filePath);
    let lastSplitIndex = relativePath.lastIndexOf('\\');
    return relativePath.substring(0, lastSplitIndex);
}

export function getFileName(filePath : string) : string {
    let lastSplitIndex = filePath.lastIndexOf('\\');
    let lastDotIndex = filePath.lastIndexOf('.');
    return filePath.substring(lastSplitIndex + 1, filePath.length);
}

export function getFileNameNoExtension(filePath : string) : string {
    let lastSplitIndex = filePath.lastIndexOf('\\');
    let lastDotIndex = filePath.lastIndexOf('.');
    return filePath.substring(lastSplitIndex + 1, lastDotIndex);
}

export function getFileExtension(filePath : string) : string {
    let lastDotIndex = filePath.lastIndexOf('.');
    return filePath.substring(lastDotIndex + 1, filePath.length);
}

export function  getCurrentWord() : string {
    let window = vscode.window;
    let editor = window.activeTextEditor;
    let document = editor.document;

    let wordRange = document.getWordRangeAtPosition(editor.selection.start);
    return document.getText(wordRange);
}
