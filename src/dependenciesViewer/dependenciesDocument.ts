"use strict";

import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import {Solution} from "../dotnet/solution";
import {Project} from "../dotnet/project";
export class DependenciesDocument {
    _emitter: any;
    _uri:  vscode.Uri;

    private static filenameWithoutExtension(filePath: string) {
        return path.basename(filePath, path.extname(filePath));
    }

    private static onlyName(dependency : {from: string, to: string}): {from: string, to: string} {
        dependency.from = DependenciesDocument.filenameWithoutExtension(dependency.from);
        dependency.to = DependenciesDocument.filenameWithoutExtension(dependency.to);
        return dependency;
    }

    constructor(uri: vscode.Uri, emitter: vscode.EventEmitter<vscode.Uri>) {
        this._uri = uri;

        // The ReferencesDocument has access to the event emitter from
        // the containg provider. This allows it to signal changes
        this._emitter = emitter;
    }

    get projects(): Thenable<string[]> {        
        return Solution.ListProjects(this._uri.query).then(
            projects => Promise.resolve( projects.map(_ => DependenciesDocument.filenameWithoutExtension(_) ) )
         );
    }

    get relationShips(): Thenable<{from: string, to: string}[]> {        
        let solutionFolder = path.dirname(this._uri.query);
        return Solution.ListProjects(this._uri.query).then((projects) => {
            
            return Promise.all(
                projects.map( project=> Project.ListProjectReferences(path.join(solutionFolder, project)).then(references =>
                  Promise.resolve(references.map<{from: string, to: string}>( (_) => <{from: string, to: string}>{ from: project, to: _} ))))).then(
                        (projectsDependencies) => {
                            let result : {from: string, to: string}[] = [];
                            for(let projectDependencies of projectsDependencies) {
                                result = result.concat(projectDependencies);
                            }            
                            return result.map( _ => DependenciesDocument.onlyName(_) );
                        }
                        
                 );            
        });
    }

    get scriptDocument() : Thenable<string> {
        let scriptFile = path.join(__dirname, "graphLoader.js");
        
        return new Promise<string>((resolve, reject) => {    
         fs.readFile(scriptFile, function (err, data) {
             if (err) {
                reject(err);
             }
             else {
                resolve(data.toString());
             }
         });
        });
    }

    get value() : Thenable<string> {
        return Promise.all([this.relationShips, this.projects, this.scriptDocument]).then((info) =>         
        Promise.resolve(`<html> <head>
        <title>VivaGraphs test page</title>
        <script src="https://anvaka.github.io/VivaGraphJS/dist/vivagraph.js"></script>
        <script type='text/javascript'>
          var relationShips = ${JSON.stringify(info[0])};
          var projects = ${JSON.stringify(info[1])};

          ${info[2]}
                        
        </script>
         <style type='text/css'>html, body, svg { width: 100%; height: 100%; background-color: white} </style>
    </head>
    <body onload="onLoad()">    </body></html>`));
    };
}