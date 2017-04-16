export  interface INodeItem {

	kind: string;
	label: string;

    getChildren(): Thenable<INodeItem[]>;
}
