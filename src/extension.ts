'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as tree from './tree/tree';
import { buildSolution }   from './build/buildSolution';
import { UiManager }   from './ui/UiManager';
import { DependenciesProvider } from './dependenciesViewer/dependenciesProvider';
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	const uiManager : UiManager = new UiManager();

    const provider = new DependenciesProvider();

	let disposable: vscode.Disposable[] = [];

	disposable.push(vscode.Disposable.from(
		vscode.workspace.registerTextDocumentContentProvider( DependenciesProvider.scheme, provider)
	));

	disposable.push(vscode.commands.registerCommand('extension.vs-solution-support.displayDependencies', () => {		
        let uri = vscode.Uri.parse(`${ DependenciesProvider.scheme}:solution?${context.workspaceState.get<string>('solutionFile')}`);
        return vscode.commands.executeCommand('vscode.previewHtml', uri, vscode.ViewColumn.Two, 'Solution Dependencies');
	}));

	disposable.push(vscode.commands.registerCommand('extension.vs-solution-support.selectPlatform', () => {		
        uiManager.selectPlatform().then((platform) => vscode.workspace.getConfiguration('solutionExplorer').update("platform", platform));
	}));

	disposable.push(vscode.commands.registerCommand('extension.vs-solution-support.selectConfiguration', () => {		
        uiManager.selectConfiguration().then((configuration) => vscode.workspace.getConfiguration('solutionExplorer').update("configuration", configuration));
	}));
    
    disposable.push(vscode.commands.registerCommand('extension.vs-solution-support.buildSolution', () => {            
        buildSolution(context.workspaceState.get<string>('solutionFile'));
    }));

	disposable.push(vscode.window.registerTreeExplorerNodeProvider('solutionExplorer', new tree.SolutionProvider(vscode.workspace.rootPath, vscode.workspace.getConfiguration('solutionExplorer'), context.workspaceState )));

	// This command will be invoked using exactly the node you provided in `resolveChildren`.
	disposable.push(vscode.commands.registerCommand('extension.vs-solution-support.openSolutionTreeItem', (node: tree.DepNode) => {
		if (node.kind === 'leaf') {
			vscode.commands.executeCommand('vscode.open', vscode.Uri.file(node.filePath));
		}
	}));

	disposable.forEach( _ => context.subscriptions.push(_));
}

// this method is called when your extension is deactivated
export function deactivate() {
}
