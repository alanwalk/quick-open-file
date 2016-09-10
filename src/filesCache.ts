'use strict';

import * as vscode from 'vscode';
import * as utils from './utils';

let MAX_CACHE_COUNT : number = 5120;

export default class FilesCache {

    private fileSystemWatcher   = null;
    private configChangeWatcher = null;
    private filesCache          = [];
    private extensionInclude    = [];
    private folderExclude       = [];
    private suffixList          = [];

    constructor()
    {
        this.updateOption();
        this.initWatcher();
        this.refreshFilesCache();
    }

    public searchFile(targetFilename : string) : vscode.Uri {
        let result = null;
        let filenameWithSuffix = [];
        
        this.filesCache.forEach(uri => {
            let filenameNoExtension = utils.getFileNameNoExtension(uri.path);
            if (filenameNoExtension == targetFilename) {                
                result = uri;
            }
            if (this.isValidFilenameWithSuffix(targetFilename, filenameNoExtension)) {
                filenameWithSuffix.push(uri);
            }
        });
        if (result == null && filenameWithSuffix.length > 0) {
            result = filenameWithSuffix[0];
        }
        return result;
    }

    private isValidFilenameWithSuffix(targetFilename : string, filename : string) : boolean{
        if (!filename.startsWith(targetFilename)) {
            return false;
        }
        let suffix = filename.substring(targetFilename.length + 1, filename.length)
        return this.suffixList.indexOf(suffix) != -1;
    }

    private updateOption() {
        let configuration       = vscode.workspace.getConfiguration('quickOpenFile');
        this.extensionInclude   = <string[]>configuration.get('extensionInclude');
        this.folderExclude      = <string[]>configuration.get('folderExclude');
        this.suffixList         = <string[]>configuration.get('suffixList');

        // default suffix '' must index = 0
        for (var index = 0; index < this.suffixList.length; index++) {
            if (this.suffixList[index] == '') {
                this.suffixList.splice(index, 1);
            }
        }
        this.suffixList.splice(0, 0, '');
    }

    private refreshFilesCache() {
        let include = '**/**{' + this.suffixList.join(',') + '}.{' + this.extensionInclude.join(',') + '}';
        let exclude = '{' + this.folderExclude.join(',') + '}'
        vscode.workspace.findFiles(include, exclude, MAX_CACHE_COUNT)
            .then(uries=>{
                this.filesCache = uries;                
            });
    }

    private initWatcher() {
        this.configChangeWatcher = vscode.workspace.onDidChangeConfiguration(this.onConfigurationChangeEvent);
        this.fileSystemWatcher = vscode.workspace.createFileSystemWatcher('**/**');
        this.fileSystemWatcher.onDidCreate(this.onFileSystemCreateEvent);
        this.fileSystemWatcher.onDidDelete(this.onFileSystemDeleteEvent);
   }

    public onFileSystemCreateEvent(uri : vscode.Uri) {
        if (this.filesCache.length > MAX_CACHE_COUNT)
            return;
        let extension = utils.getFileExtension(uri.fsPath)
        if (this.extensionInclude.indexOf(extension) != -1) {
            this.filesCache.push(uri);
        }
    }

    public onFileSystemDeleteEvent(uri : vscode.Uri) {
        for(let index = 0; index < this.filesCache.length; index++) {
            if (this.filesCache[index].path == uri.path) {
                this.filesCache.splice(index, 1);
                break;
            }
        }
    }

    public onConfigurationChangeEvent() {
        this.updateOption();
        this.refreshFilesCache();
    }

    deactivate() {
        this.configChangeWatcher.dispose();
        this.fileSystemWatcher.dispose();
    }
}
