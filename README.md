# Quick Open File

This is a extension for quickly open file, that's name start with current word.

<!-- TOC -->

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Default Settings](#default-settings)
- [License](#license)
- [Links](#links)

<!-- /TOC -->

## Features
- Allow auto complete suffix.
- Allow exclude folder.

## Installation
```
ext install quick-open-file
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
|quickOpenFile.extensionInclude|string[]|[ ".lua", ".js" ]|Set which file extension you want to include, * is any extension.|
|quickOpenFile.folderExclude|string[]|[ "node_modules", ".vscode" ]|Set which folder you want to exclude.|
|quickOpenFile.suffixList|bool|[ "*" ]|If autoCompleteSuffix is true, will auto add suffix, * is any suffix.|
|quickOpenFile.autoCompleteSuffix|string[]|false|Whether auto add suffix to word.|

## License
The package is Open Source Software released under the [License](Liscense). It's developed by AlanWalk.

## Links
- [Source Code](https://github.com/AlanWalk/quick-open-file)
- [Market](https://marketplace.visualstudio.com/items/AlanWalk.quick-open-file)
