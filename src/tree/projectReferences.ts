import {INodeItem } from "./inodeitem";
import {ReferenceNode } from "./referenceNode";
import { Project }from "../dotnet/project";
import * as path from "path";

export class ProjectReferencesNode implements INodeItem {
    kind: string;
    label: string;

    constructor(public filePath:string) {
        this.kind = "node";
        this.label = "Project References";
    }

    getChildren(): Thenable<INodeItem[]> {
        return Project.ListProjectReferences(this.filePath)
                        .then( (references) =>  Promise.resolve(
                            references.map( _ => new FileReferenceNode(path.join(path.dirname(this.filePath) ,_))).sort( (a, b) => a.label < b.label ?  1 : -1)
                            ));
    }

}

export class FileReferenceNode extends ReferenceNode {    

    constructor(private referencePath:string)  {
        super(path.basename(referencePath, path.extname(referencePath)), referencePath);
    }
}