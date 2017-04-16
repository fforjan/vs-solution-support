import * as path from "path";

import { INodeItem }from "./inodeitem";
import { Project }from "./dotnet/project";

export class ProjectNode implements INodeItem {
    kind: string;
    label: string;

    getChildren(): Thenable<INodeItem[]> {     
        return Promise.resolve([ new ProjectReferencesNode(this.projectFile), new NugetReferencesNode(this.projectFile)]);
    }

    constructor(private projectFile:string) {
        this.kind = "node";
        this.label = `${path.basename(projectFile, path.extname(projectFile))}`;
    }
}

export class ProjectReferencesNode implements INodeItem {
    kind: string;
    label: string;

    constructor(private projectFile:string) {
        this.kind = "node";
        this.label = "Project References";
    }

    getChildren(): Thenable<INodeItem[]> {
        return Project.ListProjectReferences(this.projectFile).then( (references) =>  Promise.resolve(references.map( _ => new FileReferenceNode(_))));
    }

}

export class NugetReferencesNode implements INodeItem {
    kind: string;
    label: string;

    constructor(private projectFile:string) {
        this.kind = "node";
        this.label = "Nuget Packages";
    }

    getChildren(): Thenable<INodeItem[]> {
        return Project.ListNugetPackages(this.projectFile).then( (references) =>  Promise.resolve(references.map( _ => new NugetReferenceNode(_))));
    }

}

export class ReferenceNode implements INodeItem {
    kind: string;

    getChildren(): Thenable<INodeItem[]> {
        return Promise.resolve([]);
    }

    constructor(public label:string) {
        this.kind = "leaf";
    }
}

export class FileReferenceNode extends ReferenceNode {    

    constructor(private referencePath:string)  {
        super(path.basename(referencePath, path.extname(referencePath)));
    }
}

export class NugetReferenceNode extends ReferenceNode {
    constructor(private info : {id:string, version:string})  {
        super(info.id);
    }
}