import {INodeItem} from './inodeitem';
import {ProjectNode } from './project';
import {spawn} from "child_process";
import * as path from 'path';

const dotnet = "dotnet";
export class SolutionNode  implements INodeItem {
    solutionFile: string;
    kind: string = 'root'
    label: string = "solution";
    
    constructor(solutionFile : string) {
        this.solutionFile = solutionFile;        
    }

    getChildren(): Thenable<INodeItem[]> {        
        return new Promise<string>( (resolve)=> {
                var result = "";                            
                var solutionListProcess = spawn(dotnet,["sln", this.solutionFile ,"list"]);
                solutionListProcess.stdout.setEncoding('utf8');
                solutionListProcess.stdout.on('data', (data) => { result +=  data.toString();});
                solutionListProcess.on('exit', () => {
                    resolve(result);
                });
        }).then( (result) => { return new Promise<INodeItem[]>((resolve) =>
            {
                var projects = SolutionNode.SplitIntoLines(result);
                var directory = path.dirname(this.solutionFile);
                resolve(projects.map( project => new ProjectNode(path.join(directory, project))));
            })
        });
    }

    private static SplitIntoLines(stdout: string): string[] {
        if (!stdout) {
            return [];
        }

        let lines: string[] = stdout.replace(/\r\n/g, "\n").split("\n");
        lines.shift();        
        lines.shift();       
        lines = lines.filter((e) => e.trim() !== ""); 
        return lines;
    }
}