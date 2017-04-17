import {INodeItem, alphabeticalOrdering } from "./inodeitem";
import {FileReferenceNode } from "./referenceNode";
import { Project }from "../dotnet/project";

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
                            references.map( _ => FileReferenceNode.Create(this ,_, false)).sort(alphabeticalOrdering)
                            ));
    }

}