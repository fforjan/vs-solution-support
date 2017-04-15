import * as path from "path";

import { INodeItem }from "./inodeitem";
import { Project }from "./dotnet/project";

export class ProjectNode implements INodeItem {
    kind: string;
    label: string;

    getChildren(): Thenable<INodeItem[]> {
        return Project.ListProjectReferences(this.projectFile).then( (references) =>  Promise.resolve(references.map( _ => new ReferenceNode(_))))
    }

    constructor(private projectFile:string) {
        this.kind = "node";
        this.label = path.basename(projectFile, path.extname(projectFile));
    }
}

export class ReferenceNode implements INodeItem {
    kind: string;
    label: string;

    getChildren(): Thenable<INodeItem[]> {
        return Promise.resolve([]);
    }

    constructor(private referencePath:string) {
        this.kind = "leaf";
        this.label = path.basename(referencePath, path.extname(referencePath));
    }
}