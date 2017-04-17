import {INodeItem } from "./inodeitem";
import * as path from "path";

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

    constructor(private referencePath:string, showExtension: boolean)  {
        super(path.basename(referencePath, showExtension ? "" : path.extname(referencePath)), referencePath);
    }

    public static Create( container: INodeItem, relativeFilePath:string, showExtension: boolean) {
        return new FileReferenceNode(path.join(path.dirname(container.filePath), relativeFilePath), showExtension);
    }
}