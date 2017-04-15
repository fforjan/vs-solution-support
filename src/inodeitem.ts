export  interface INodeItem {

	readonly kind: string;
	readonly label:string;

    getChildren(): Thenable<INodeItem[]>;
}
