import * as vscode from "vscode";

/**
 * UI Manager for all nuget related activities.
 */
export class UiManager {

	/**
	 * Ask the user to make a choice between packages from reduced package information
	 */
	public selectConfiguration(): Thenable<string> {
		let configuration: vscode.QuickPickItem[] = [{
					label: "Debug",
					description: "Debug build"
				},
				{
					label: "Release",
					description: "Release build",					
				}];

		return vscode.window.showQuickPick(configuration, { placeHolder: "Select the configuration"}).then(result => Promise.resolve(result.label));
	}

	/**
	 * Ask the user to make a choice between packages from reduced package information
	 */
	public selectPlatform(): Thenable<string> {
		let configuration: vscode.QuickPickItem[] = [{
					label: "Any CPU",
					description: "Any CPU"
				}];

		return vscode.window.showQuickPick(configuration, { placeHolder: "Select the configuration"}).then(result => Promise.resolve(result.label));
	}
}