import * as path from "path";

import { INodeItem }from "./inodeitem";

export class ProjectNode implements INodeItem {
    kind: string;
    label: string;

    getChildren(): Thenable<INodeItem[]> {
        return Promise.resolve([]);
    }

    constructor(private projectFile:string) {
        this.kind = "leaf";
        this.label = path.basename(projectFile, path.extname(projectFile));
    }
}