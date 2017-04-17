import {INodeItem } from "./inodeitem";
import {ReferenceNode } from "./referenceNode";
import { Project }from "../dotnet/project";

export class NugetReferencesNode implements INodeItem {
    kind: string;
    label: string;

    constructor(public filePath:string) {
        this.kind = "node";
        this.label = "Nuget Packages";
    }

    getChildren(): Thenable<INodeItem[]> {
        return Project.ListNugetPackages(this.filePath).then( (references) =>  Promise.resolve(references.map( _ => new NugetReferenceNode(this.filePath, _))));
    }

}

export class NugetReferenceNode extends ReferenceNode {
    constructor(fielPath: string, private info : {id:string, version:string})  {
        super(info.id, fielPath);
    }
}
