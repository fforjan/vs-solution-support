# vs-solution-support README

Welcome to the vs-solution-support readme.
This extension is bringing some concept of Visual Studio to Visual Studio Code and the goal is to support doing WPF/C# development via vscode.

[![Build status](https://travis-ci.org/fforjan/vs-solution-support.svg)](https://travis-ci.org/fforjan/vs-solution-support)

## Features
- Ability to pick a solution file - manually 
- Simple solution explorer
    At the moment the solution explorer displays only the solution node, projects (flat list) and dlls/nuget references.    
- allow to build solution from VSCode

## Requirements

This rely on dotnet cli and need to be installed and msbuild to be available on command line.

## Extension Settings

Configuration points :

 - solutionExplorer.file : solution to be used.
 - solutionExplorer.configuration : which configuration (debug/release) to be build.
 - solutionExplorer.platform : which platform (ANy CPU,...) to be build.

## Known Issues


## Release Notes

### 0.0.1

First cut !

