# Quick Open File

This is a extension for quickly open file, that's name start with current word.

<!-- TOC -->

- [Quick Open File](#quick-open-file)
    - [Features](#features)
    - [Installation](#installation)
    - [Usage](#usage)
    - [Keyboard Shortcuts](#keyboard-shortcuts)
    - [Default Settings](#default-settings)
    - [ChangeLog](#changelog)
    - [License](#license)
    - [Links](#links)

<!-- /TOC -->

## Features
- Allow auto complete suffix.
- Allow exclude folder.

## Installation
```
ext install alanwalk.quick-open-file
```

## Usage
1. Move cursor to keyword, and click it.
1. Ctrl+Shift+P / F1, input 'Quick Open File'. Or use `alt + g`.

## Keyboard Shortcuts
```
{ "command":"extension.quickOpenFile", "key":"alt+g" }
```
This is default setting, you can override in your keyboard shortcuts.

## Default Settings
|attributes|values|defaults|description|
|---|---|---|---|
|quickOpenFile.peekLanguages|string[]|[ "lua", "javascript" ]|Set which type you want to use peek. it's language id, not extension. |
|quickOpenFile.extensionInclude|string[]|[ "lua", "js" ]|Set which file extension you want to include, ** is any extension.|
|quickOpenFile.folderExclude|string[]|[ "node_modules", ".vscode" ]|Set which folder you want to exclude, '' is include any folder.|
|quickOpenFile.suffixList|string[]|[]|Auto add suffix when search file(not allow peek), ** is match any suffix.|

## ChangeLog
- 0.1.3
    - peek operation don't match suffix
    
- 0.1.2
    - Init file caches when active

- 0.1.1
    - Fix bug

- 0.1.0
    - Allow peek use mouse

- 0.0.2
    - Revise Default Settings

- 0.0.1
    - First Version

## License
The package is Open Source Software released under the [License](Liscense). It's developed by AlanWalk.

## Links
- [Source Code](https://github.com/AlanWalk/quick-open-file)
- [Market](https://marketplace.visualstudio.com/items/AlanWalk.quick-open-file)
