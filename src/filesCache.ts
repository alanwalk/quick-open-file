'use strict';

import * as vscode from 'vscode';
import * as utils from './utils';

let MAX_CACHE_COUNT: number = 5120;

export default class FilesCache {

    /**
      * Instance
      */
    private static _instance = null;
    
    public static GetInstance(): FilesCache {
        if (FilesCache._instance == null) {
            FilesCache._instance = new FilesCache();
        }
        return FilesCache._instance;
    }

    /**
     * Core
     */
    private fileSystemWatcher = null;
    private configChangeWatcher = null;
    private cache = [];
    private extensionInclude = [];
    private folderExclude = [];
    private suffixList = [];

    constructor() {
        this.updateOption();
        this.initWatcher();
        this.refreshFilesCache();
    }

    public searchFile(targetFilename: string): vscode.Uri[] {
        let result = [];
        this.cache.forEach(uri => {
            let filenameNoExtension = utils.getFileNameNoExtension(uri.path);
            if (this.isValidFilenameWithSuffix(targetFilename, filenameNoExtension)) {
                result.push(uri);
            }
        });
        return result;
    }

    private isValidFilenameWithSuffix(targetFilename: string, filename: string): boolean {
        if (!filename.startsWith(targetFilename)) {
            return false;
        }
        let suffix = filename.substring(targetFilename.length, filename.length)
        return this.suffixList.indexOf(suffix) != -1;
    }

    private updateOption() {
        let configuration = vscode.workspace.getConfiguration('quickOpenFile');
        this.extensionInclude = <string[]>configuration.get('extensionInclude');
        this.folderExclude = <string[]>configuration.get('folderExclude');
        this.suffixList = <string[]>configuration.get('suffixList');

        // default suffix '' must index = 0
        for (var index = 0; index < this.suffixList.length; index++) {
            if (this.suffixList[index] == '') {
                this.suffixList.splice(index, 1);
            }
        }
        this.suffixList.splice(0, 0, '');
    }

    private initWatcher() {
        this.configChangeWatcher = vscode.workspace.onDidChangeConfiguration(() => {
            this.updateOption();
            this.refreshFilesCache();
        });
        this.fileSystemWatcher = vscode.workspace.createFileSystemWatcher('**/*');
        this.fileSystemWatcher.onDidCreate(uri => {
            if (this.cache.length > MAX_CACHE_COUNT)
                return;
            let extension = utils.getFileExtension(uri.fsPath)
            if (this.extensionInclude.indexOf(extension) != -1) {
                this.cache.push(uri);
            }
        });
        this.fileSystemWatcher.onDidDelete(uri => {
            for (let index = 0; index < this.cache.length; index++) {
                if (this.cache[index].path == uri.path) {
                    this.cache.splice(index, 1);
                    break;
                }
            }
        });
    }
    
    private refreshFilesCache() {
        let include = '**/*.{' + this.extensionInclude.join(',') + '}';
        let exclude = '{' + this.folderExclude.join(',') + '}'
        vscode.workspace.findFiles(include, exclude, MAX_CACHE_COUNT)
            .then(uries => {
                this.cache = uries;
            });
    }

    deactivate() {
        this.configChangeWatcher.dispose();
        this.fileSystemWatcher.dispose();
    }
}
