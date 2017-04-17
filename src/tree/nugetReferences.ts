import {INodeItem } from "./inodeitem";
import * as vscode from "vscode";
import {ReferenceNode } from "./referenceNode";
import { Project }from "../dotnet/project";

export class NugetReferencesNode implements INodeItem {
    kind: string;
    label: string;

    constructor(public filePath) {
        this.kind = "node";
        this.label = "Nuget Packages";
    }

    getChildren(): Thenable<INodeItem[]> {
        return Project.ListNugetPackages(this.filePath).then( (references) =>  Promise.resolve(references.map( _ => new NugetReferenceNode(_))));
    }

}

export class NugetReferenceNode extends ReferenceNode {
    constructor(private info : {id:string, version:string})  {
        super(info.id, vscode.Uri.parse(`https://www.nuget.org/packages/${info.id}/${info.version}`));
    }
}
