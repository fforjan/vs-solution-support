import * as vscode from "vscode";

export class StatusBar {
    _statusBarPlatform: vscode.StatusBarItem;
    _statusBarConfiguration: vscode.StatusBarItem;

    public update(platform:string, configuration: string) { 
        this.updatePlatform(platform);
        this.updateConfiguration(configuration);            
     }

    public updatePlatform(platform:string) {    
        if (!this._statusBarPlatform) {
            this._statusBarPlatform =vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
            this._statusBarPlatform.command = "extension.vs-solution-support.selectPlatform";
        }

        this._statusBarPlatform.text = platform;        
        this._statusBarPlatform.show(); 
    }       

    public updateConfiguration(configuration:string) {    

        if (!this._statusBarConfiguration) {
            this._statusBarConfiguration =vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
            this._statusBarConfiguration.command = "extension.vs-solution-support.selectConfiguration";
        }
        
        this._statusBarConfiguration.text = configuration;        
        this._statusBarConfiguration.show();        
    }
}