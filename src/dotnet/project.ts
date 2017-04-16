import { Dotnet } from './dotnet';

import * as path from 'path';
import * as fs from 'fs';

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

    public static ListNugetPackages(projectFile:string): Thenable<{id:string, version:string}[]> {
        let packageConfigFile = path.join(path.dirname(projectFile), "packages.config");

        return new Promise<{id:string, version:string}[]>((resolve, reject) => {
            fs.readFile(packageConfigFile, function (err, data) {
             if (err) resolve([]);
             else {
                let xmlContent = data.toString();
                const regex = /id="([^"]*)".*version="([^"]*)"/g;
                let m : RegExpExecArray;
                let result:{id:string, version:string}[] = [];

                while ((m = regex.exec(xmlContent)) !== null) {
                    // This is necessary to avoid infinite loops with zero-width matches
                    if (m.index === regex.lastIndex) {
                        regex.lastIndex++;
                    }
    
                    // The result can be accessed through the `m`-variable.                    
                    result.push({id: m[1], version:m[2]});                    
                }

                resolve(result);
             }
            });
        });
    }
}