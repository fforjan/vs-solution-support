import * as vscode from 'vscode';

import * as fs from 'fs';
import * as path from 'path';
import { INodeItem } from './inodeitem';
import { SolutionNode } from './solution';

export class SolutionProvider implements vscode.TreeExplorerNodeProvider<DepNode>, INodeItem {
	kind: string;
	label: string;
	constructor(private workspaceRoot: string, private configuration: any) {
		this.kind = 'root';
	}

	/**
	 * As root node is invisible, its label doesn't matter.
	 */
	getLabel(node: DepNode): string {
		return node.label;
	}

	/**
	 * Leaf is unexpandable.
	 */
	getHasChildren(node: DepNode): boolean {
		return node.kind !== 'leaf';
	}

	/**
	 * Invoke `extension.openPackageOnNpm` command when a Leaf node is clicked.
	 */
	getClickCommand(node: DepNode): string {
		return node.kind === 'leaf' ? 'extension.openPackageOnNpm' : null;
	}

	provideRootNode(): DepNode {
		return this;
	}

	resolveChildren(node: DepNode): Thenable<DepNode[]> {
		if (!this.workspaceRoot) {
			vscode.window.showInformationMessage('No dependency in empty workspace');
			return Promise.resolve([]);
		}		

		return node.getChildren();
	}

	getChildren(): Thenable<DepNode[]> {		
		return new Promise<DepNode[]>((resolve) => 
		{
			var solution = <string>this.configuration.file || fs.readdirSync(this.workspaceRoot).find( _ => _.endsWith('.sln'));
			
			resolve([ 
				new SolutionNode(path.join(this.workspaceRoot, solution ))
				]
			);
		});
	}
}

export type DepNode = INodeItem;