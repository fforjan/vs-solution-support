import { Dotnet } from './dotnet';

import * as vscode from 'vscode';
export class Solution {

    public static ListProjects(solutionFile: string) :Thenable<string[]> {        
        return Dotnet.execute( ["sln", solutionFile ,"list"]).then(result => {
            // skip header=            
            return Promise.resolve(result.filter( _ => _.endsWith("proj")));
        })
    }
}