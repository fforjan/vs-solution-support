import {INodeItem} from './inodeitem';
import {ProjectNode } from './project';
import * as path from 'path';
import {Solution} from './dotnet/solution';

export class SolutionNode  implements INodeItem {
    solutionFile: string;
    kind: string = 'root';
    label: string;
    
    constructor(solutionFile : string) {
        this.solutionFile = solutionFile;        
        this.label = path.basename(this.solutionFile, ".sln");    
    }

    getChildren(): Thenable<INodeItem[]> {        
        var directory = path.dirname(this.solutionFile);
        return Solution.ListProjects(this.solutionFile).then( (projects) => Promise.resolve(projects.map( project => new ProjectNode(path.join(directory, project)))));            
    }   
}