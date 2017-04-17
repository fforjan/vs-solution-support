import * as vscode from "vscode";
import { Solution } from "../dotnet/solution";

/**
 * UI Manager for all nuget related activities.
 */
export class UiManager {

	/**
	 * Ask the user to make a choice between packages from reduced package information
	 */
	public selectConfiguration(solutionFile: string): Thenable<string> {
		return Solution.ListPlatformAndConfiguration(solutionFile).then(
			data => {
				let configuration: vscode.QuickPickItem[] = data.configuration.map(_ => { return { label: _, description: _ }; });

				return vscode.window.showQuickPick(configuration, { placeHolder: "Select the configuration" }).then(result => Promise.resolve(result.label));
			});
	}

	/**
	 * Ask the user to make a choice between packages from reduced package information
	 */
	public selectPlatform(solutionFile: string): Thenable<string> {
		return Solution.ListPlatformAndConfiguration(solutionFile).then(
			data => {
				let configuration: vscode.QuickPickItem[] = data.platform.map(_ => { return { label: _, description: _ }; });

				return vscode.window.showQuickPick(configuration, { placeHolder: "Select the configuration" }).then(result => Promise.resolve(result.label));
			});
	}

	public displayDotNotCliNotinstalled() {
		vscode.window.showErrorMessage("dotnet cli is not installed, please visit https://www.microsoft.com/net/core#windowscmd");
	}
}