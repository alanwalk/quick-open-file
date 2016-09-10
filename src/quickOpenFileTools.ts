'use strict'

import * as vscode from 'vscode';
import * as utils from './utils';

export default class QuickOpenFileTools {

    private extensionInclude    = [];
    private folderExclude       = [];
    private suffixList          = [];
    private autoCompleteSuffix  = true;

    public findFiles() {
        this.updateOption();

        let word = utils.getCurrentWord();
        let include = '**/' + word + '{' + this.suffixList.join(',') + '}.{' + this.extensionInclude.join(',') + '}';
        let exclude = '{' + this.folderExclude.join(',') + '}'

        console.log(include, '\n', exclude);

        vscode.workspace.findFiles(include, exclude, 100)
            .then(uries=>{
                this.showResult(uries);
            });
    }

    private updateOption() {
        let configuration       = vscode.workspace.getConfiguration('quickOpenFile');
        this.extensionInclude   = <string[]>configuration.get('extensionInclude');
        this.folderExclude      = <string[]>configuration.get('folderExclude');
        this.suffixList         = <string[]>configuration.get('suffixList');

        // default suffix '' must index = 0
        for (var index = 0; index < this.suffixList.length; index++) {
            if (this.suffixList[index] == '') {
                this.suffixList.splice(index, 1)
            }
        }
        this.suffixList.splice(0, 0, '')
    }

    private showResult(uries : vscode.Uri[]) {
        let length = uries.length;
        if (length <= 0) {
            vscode.window.showWarningMessage("Target file is not found, please ensure extension settings is correct.");
        } else if (length == 1) {
            utils.openFile(uries[0].fsPath);
        } else {
            utils.showFileQuickPick(uries);
        }
    }
}
