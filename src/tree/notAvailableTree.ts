import * as vscode from "vscode";
import { UiManager } from "../ui/UiManager";

export class NotAvailableSolution implements vscode.TreeExplorerNodeProvider<DepNode>, DepNode {
	kind: string;
	label: string;

	constructor() {
		this.kind = "root";
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
		return node.kind !== "leaf";
	}	

	provideRootNode(): DepNode {
		return this;
	}

	resolveChildren(node: DepNode): DepNode[] {
		if(node === this) {            
            return [{
                label: UiManager.dotnetCliInstallMessage,
                kind: "leaf"
            }];
        }
        return [];
	}

    getClickCommand() :string  { 
        return "extension.vs-solution-support.openSolutionTreeItem";
    }
}

export type DepNode = {label:string, kind:string};