import * as path from "path";

import { INodeItem }from "./inodeitem";
import { Project }from "../dotnet/project";

export class ProjectNode implements INodeItem {
    kind: string;
    label: string;

    getChildren(): Thenable<INodeItem[]> {     
        return Promise.resolve([ new ProjectReferencesNode(this.filePath), new NugetReferencesNode(this.filePath)]);
    }

    constructor(public filePath:string) {
        this.kind = "node";
        this.label = `${path.basename(filePath, path.extname(filePath))}`;
    }
}

export class ProjectReferencesNode implements INodeItem {
    kind: string;
    label: string;

    constructor(public filePath:string) {
        this.kind = "node";
        this.label = "Project References";
    }

    getChildren(): Thenable<INodeItem[]> {
        return Project.ListProjectReferences(this.filePath).then( (references) =>  Promise.resolve(references.map( _ => new FileReferenceNode(_))));
    }

}

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

export class ReferenceNode implements INodeItem {
    kind: string;

    getChildren(): Thenable<INodeItem[]> {
        return Promise.resolve([]);
    }

    constructor(public label:string, public filePath:string) {
        this.kind = "leaf";
    }
}

export class FileReferenceNode extends ReferenceNode {    

    constructor(private referencePath:string)  {
        super(path.basename(referencePath, path.extname(referencePath)), referencePath);
    }
}

export class NugetReferenceNode extends ReferenceNode {
    constructor(fielPath: string, private info : {id:string, version:string})  {
        super(info.id, fielPath);
    }
}