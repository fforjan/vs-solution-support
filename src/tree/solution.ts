import {INodeItem, alphabeticalOrdering} from "./inodeitem";
import {ProjectNode } from "./project";
import * as path from "path";
import {Solution} from "../dotnet/solution";

export class SolutionNode  implements INodeItem {    
    kind: string = "root";
    label: string;
    
    constructor(public filePath : string) {
        this.filePath = filePath;        
        this.label = path.basename(this.filePath, ".sln");    
    }

    getChildren(): Thenable<INodeItem[]> {        
        let directory = path.dirname(this.filePath);
        return Solution.ListProjects(this.filePath).then(
             (projects) => Promise.resolve(
                 projects.map( project => new ProjectNode(path.join(directory, project))).sort( alphabeticalOrdering)
            ));            
    }   
}