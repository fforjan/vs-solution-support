import * as vscode from 'vscode';
import * as cp from 'child_process';

function convertSeverity(severity:string) : vscode.DiagnosticSeverity {
    switch(severity) 
    {
        case "error": return vscode.DiagnosticSeverity.Error;
        case "warning": return vscode.DiagnosticSeverity.Warning;
        case "info": return vscode.DiagnosticSeverity.Information;
    }
}

function analyseOutput(buildOutput: string, diagnostic: vscode.DiagnosticCollection): void {
    var regexp = /([^\s].*)\((\d+|\d+,\d+|\d+,\d+,\d+,\d+)\)\s*:\s+(error|warning|info)\s+(\w{1,2}\d+)\s*:\s*(.*)/g;
    let m : RegExpExecArray;    

    var messages : {[file:string] : vscode.Diagnostic[]} = {};

    while ((m = regexp.exec(buildOutput)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regexp.lastIndex) {
            regexp.lastIndex++;
        }

        // file: 1, location: 2, severity: 3, code: 4, message: 5
       var file = m[1];       
        var diagnostics: vscode.Diagnostic[] = messages[file];
        if(!diagnostics) {
             diagnostics = messages[file] = [];
        }

        var location = m[2].split(',').map(_ => Number.parseInt(_));

        diagnostics.push(new vscode.Diagnostic(new vscode.Range(location[0], location[1], location[0], location[1]), m[5], convertSeverity(m[3])));        
    }

    Object.keys(messages).forEach(file => {
        var uri = vscode.Uri.file(file);        
        diagnostic.set(uri, messages[file]);
    });
}

export function buildSolution(solutionPath : string) {

    // ensure all files are saved
    vscode.workspace.saveAll();

    let buildOutput  = "";
    let channel = vscode.window.createOutputChannel("VSBuild");
    channel.clear();
    channel.show(true);

    const msbuidArgs= ["/t:Build", "/verbosity:quiet", "/m", "/property:GenerateFullPaths=true", solutionPath];

    let process = cp.spawn("msbuild", msbuidArgs);
    process.stdout.on('data', chunk => {
        var text = chunk.toString();
        buildOutput +=text;
        channel.append(text);}
    );
    process.stderr.on('data', chunk => {
        var text = chunk.toString();
        buildOutput +=text;
        channel.append(text);}
    );
    process.on('close', code => {
      var diagnostic = vscode.languages.createDiagnosticCollection("msbuild") ;
      diagnostic.clear();
      analyseOutput(buildOutput, diagnostic);
    });
}