'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as tree from './tree';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "vs-solution-support" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.sayHello', () => {
        // The code you place here will be executed every time your command is executed

        // Display a message box to the user
        vscode.window.showInformationMessage('Hello World!');
    });

    const rootPath = vscode.workspace.rootPath;

	// The `providerId` here must be identical to `contributes.explorer.treeExplorerNodeProviderId` in package.json.
	vscode.window.registerTreeExplorerNodeProvider('depTree', new tree.DepNodeProvider(rootPath));

	// This command will be invoked using exactly the node you provided in `resolveChildren`.
	vscode.commands.registerCommand('extension.openPackageOnNpm', (node: tree.DepNode) => {
		if (node.kind === 'leaf') {
			vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(`https://www.npmjs.com/package/${node.moduleName}`));
		}
	});

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}

