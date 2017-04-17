import {INodeItem, alphabeticalOrdering } from "./inodeitem";
import * as path from "path";
import {FileReferenceNode } from "./referenceNode";
import { Project }from "../dotnet/project";

class ItemNode {
     public immediateChildren: string[];
     public withSubFolder: {[folderName: string]: {currentPath:string, finalPath:string}[]};     
     
     constructor(files: {currentPath:string, finalPath:string}[]) {
        this.immediateChildren = [];
        this.withSubFolder = {};
        for(let file of files) {
            let directorySep = file.currentPath.indexOf("\\");
            if(directorySep === -1 ) {
                this.immediateChildren.push(file.finalPath);
            }
            else {
                let folder = file.currentPath.substring(0, directorySep);
                if( this.withSubFolder[folder] === undefined) {
                    this.withSubFolder[folder] = [];
                }
                
                let remainingPath = file.currentPath.substring(directorySep + 1);

                this.withSubFolder[folder].push({currentPath:remainingPath, finalPath: file.finalPath});                
            }
        }
     }

     public static fromProjectFile(projectFile: string): Thenable<ItemNode> {
        return Project.ListFilesToCompile(projectFile).then( files => {            
            let data = files.map(_ => {return {currentPath:_, finalPath:_};});
            return Promise.resolve(new ItemNode(data));
        });
     }
}

export class FolderNode implements INodeItem {
    kind: string;
    label: string;

    constructor(public filePath:string,private node: Thenable<ItemNode>, label ?: string,) {
        this.kind = "node";                 
        if(!label) {
            this.label = path.basename(filePath);
        }
        else {
            this.label = label;
        }
    }

    getImmediateChildren(): Thenable<INodeItem[]> {
        return this.node.then( data => Promise.resolve(data.immediateChildren.map( _ => FileReferenceNode.Create(this, _, true)).sort(alphabeticalOrdering)));
    }  

    getFolderChildren(): Thenable<INodeItem[]> {
       return this.node.then( data => Object.keys(data.withSubFolder).map(_ => new FolderNode(path.join(this.filePath, _), Promise.resolve(new ItemNode(data.withSubFolder[_])))));
    }    

    getChildren(): Thenable<INodeItem[]> {
        return Promise.all([this.getFolderChildren(), this.getImmediateChildren()]).then( result => {
            return result[0].concat(result[1]);
        });
    }
}

export class ItemsNode extends FolderNode {    
    constructor(filePath:string) {
        super(path.dirname(filePath), ItemNode.fromProjectFile(filePath),"Items");        
    }    
}