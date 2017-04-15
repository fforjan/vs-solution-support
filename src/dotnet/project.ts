import { Dotnet } from './dotnet';

import * as vscode from 'vscode';
export class Project {

    public static ListProjectReferences(projectFile: string) :Thenable<string[]> {        
        return Dotnet.execute( ["list", projectFile ,"reference"]).then(result => {
            // skip header
            result.shift();
            result.shift();
            return Promise.resolve(result);
        })
    }
}