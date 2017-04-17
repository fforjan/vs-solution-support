// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as tree from "./tree/tree";
import { buildSolution }   from "./build/buildSolution";
import { UiManager }   from "./ui/UiManager";
import { StatusBar }   from "./ui/statusBar";
import { DependenciesProvider } from "./dependenciesViewer/dependenciesProvider";
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	let disposable: vscode.Disposable[] = [];

	const uiManager = new UiManager();
	const statusBar = new StatusBar();
    const provider = new DependenciesProvider();
	const getCurrentConfiguration =  () => vscode.workspace.getConfiguration("solutionExplorer");
	statusBar.update(<string>getCurrentConfiguration().get("platform"), <string>getCurrentConfiguration().get("configuration"));

	disposable.push(vscode.workspace.onDidChangeConfiguration(() => {
		let currentConf = getCurrentConfiguration();
		statusBar.update(<string>currentConf.get("platform"), <string>currentConf.get("configuration"));}));	

	disposable.push(vscode.Disposable.from(
		vscode.workspace.registerTextDocumentContentProvider( DependenciesProvider.scheme, provider)
	));

	disposable.push(vscode.commands.registerCommand("extension.vs-solution-support.displayDependencies", () => {		
        let uri = vscode.Uri.parse(`${ DependenciesProvider.scheme}:solution?${context.workspaceState.get<string>("solutionFile")}`);
        return vscode.commands.executeCommand("vscode.previewHtml", uri, vscode.ViewColumn.One, "Solution Dependencies");
	}));

	disposable.push(vscode.commands.registerCommand("extension.vs-solution-support.selectPlatform", () => {		
        uiManager.selectPlatform(context.workspaceState.get<string>("solutionFile")).then((platform) => getCurrentConfiguration().update("platform", platform));
	}));

	disposable.push(vscode.commands.registerCommand("extension.vs-solution-support.selectConfiguration", () => {		
        uiManager.selectConfiguration(context.workspaceState.get<string>("solutionFile")).then((configuration) => getCurrentConfiguration().update("configuration", configuration));
	}));
    
    disposable.push(vscode.commands.registerCommand("extension.vs-solution-support.buildSolution", () => {            
        buildSolution(context.workspaceState.get<string>("solutionFile"), <string>getCurrentConfiguration().get("configuration"), <string>getCurrentConfiguration().get("platform") );
    }));

	disposable.push(vscode.window.registerTreeExplorerNodeProvider("solutionExplorer", new tree.SolutionProvider(vscode.workspace.rootPath, getCurrentConfiguration, context.workspaceState )));

	// This command will be invoked using exactly the node you provided in `resolveChildren`.
	disposable.push(vscode.commands.registerCommand("extension.vs-solution-support.openSolutionTreeItem", (node: tree.DepNode) => {
		if (node.kind === "leaf") {
			let documentUri: vscode.Uri = node.filePath as vscode.Uri;
			if(typeof documentUri === "string") {
				documentUri = vscode.Uri.file(<string>node.filePath);
			}
		
			vscode.commands.executeCommand("vscode.open", documentUri);
		}
	}));

	disposable.forEach( _ => context.subscriptions.push(_));
}

// this method is called when your extension is deactivated
export function deactivate() {
}
