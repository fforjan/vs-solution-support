import * as vscode from 'vscode';
import * as cp from 'child_process';

export function buildSolution(solutionPath : string) {

    let channel = vscode.window.createOutputChannel("VSBuild");
    channel.clear();

    channel.show(true);

    const msbuidArgs= ["/t:Build", solutionPath];

    let process = cp.spawn("msbuild", msbuidArgs);
    process.stdout.on('data', chunk => channel.append(chunk.toString()));
    process.stderr.on('data', chunk => channel.append(chunk.toString()));
    process.on('close', code => {
        if(code) {
            channel.append("Error : build failed");
        }
        else {
            channel.append("Success : build failed");
        }
    });
}