'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as tree from './tree';
import { buildSolution }   from './build/buildSolution';
import { DependenciesProvider } from './dependenciesViewer/dependenciesProvider';
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    const provider = new DependenciesProvider();

	// register content provider for scheme `references`
	// register document link provider for scheme `references`
	const providerRegistrations = vscode.Disposable.from(
		vscode.workspace.registerTextDocumentContentProvider( DependenciesProvider.scheme, provider)
	);

	// register command that crafts an uri with the `references` scheme,
	// open the dynamic document, and shows it in the next editor
	const commandRegistration = vscode.commands.registerCommand('extension.vs-solution-support.displayDependencies', () => {		
        let uri = vscode.Uri.parse(`${ DependenciesProvider.scheme}:solution`);
        return vscode.commands.executeCommand('vscode.previewHtml', uri, vscode.ViewColumn.Two, 'Solution Dependencies');
	});
    
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.vs-solution-support.buildSolution', () => {            
        buildSolution(context.workspaceState.get<string>('solutionFile'));
    });

    const rootPath = vscode.workspace.rootPath;    
	vscode.window.registerTreeExplorerNodeProvider('solutionExplorer', new tree.SolutionProvider(rootPath, vscode.workspace.getConfiguration('solutionExplorer'), context.workspaceState ));

	// This command will be invoked using exactly the node you provided in `resolveChildren`.
	vscode.commands.registerCommand('extension.openPackageOnNpm', (node: tree.DepNode) => {
		if (node.kind === 'leaf') {
			vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(`https://www.npmjs.com/package/${node.label}`));
		}
	});

    context.subscriptions.push(
        disposable,
		provider,
		commandRegistration,
		providerRegistrations
	);
}

// this method is called when your extension is deactivated
export function deactivate() {
}
