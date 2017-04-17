import {INodeItem, alphabeticalOrdering } from "./inodeitem";
import {FileReferenceNode } from "./referenceNode";
import { Project }from "../dotnet/project";

export class ItemsNode implements INodeItem {
    kind: string;
    label: string;

    constructor(public filePath:string) {
        this.kind = "node";
        this.label = "Items";
    }

    getChildren(): Thenable<INodeItem[]> {
        return Project.ListFilesToCompile(this.filePath)
                        .then( (files) =>  
                            Promise.resolve(
                                files.map( _ => FileReferenceNode.Create(this, _, true)).sort(alphabeticalOrdering)
                                ));
    }

}
