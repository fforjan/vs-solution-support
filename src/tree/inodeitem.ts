export  interface INodeItem {

	kind: string;
	label: string;

	filePath : string;
    getChildren(): Thenable<INodeItem[]>;
}
