export  interface INodeItem {

	kind: string;
	label: string;

	filePath : string;
    getChildren(): Thenable<INodeItem[]>;
}

export function alphabeticalOrdering(a: INodeItem ,b: INodeItem ) : number{
	return a.label < b.label ?  -1 : 1;
}
