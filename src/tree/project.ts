import * as path from "path";

import { INodeItem }from "./inodeitem";
import { ProjectReferencesNode }from "./projectReferences";
import { NugetReferencesNode }from "./nugetReferences";

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