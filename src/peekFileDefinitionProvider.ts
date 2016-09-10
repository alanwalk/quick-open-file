'use strict';

import * as vscode from 'vscode';
import FilesCache from './filesCache';

export default class PeekFileDefinitionProvider implements vscode.DefinitionProvider {

    filesCache : FilesCache = null;

    constructor() {
        this.filesCache = new FilesCache();;
    }

    provideDefinition(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken) : vscode.Definition {
        let wordRange = document.getWordRangeAtPosition(position);
        let word =  document.getText(wordRange);
        
        let fileUri = this.filesCache.searchFile(word);
        if (fileUri) {            
            return new vscode.Location(fileUri, new vscode.Position(0, 0));
        }
        return null;
   }
}
