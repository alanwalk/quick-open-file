'use strict';

import * as vscode from 'vscode';
import FilesCache from './filesCache';

export default class PeekFileDefinitionProvider implements vscode.DefinitionProvider {

    provideDefinition(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken) : vscode.Definition {
        let wordRange = document.getWordRangeAtPosition(position);
        let word =  document.getText(wordRange);
        
        let fileUri = FilesCache.GetInstance().searchFile(word);
        if (fileUri.length > 0) {            
            return new vscode.Location(fileUri[0], new vscode.Position(0, 0));
        }
        return null;
   }
}
