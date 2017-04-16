import {spawn} from "child_process";
const dotnet = "dotnet";

export class Dotnet {

    public static execute(args: string[]) : Thenable<string[]> {

            return new Promise<string[]>( (resolve) => {
                let result = "";
                let solutionListProcess = spawn(dotnet,args);
                solutionListProcess.stdout.setEncoding('utf8');
                solutionListProcess.stdout.on('data', (data) => { result +=  data.toString();});
                solutionListProcess.on('exit', () => {
                    resolve(Dotnet.splitIntoLines(result));
                });
            });
    }

     private static splitIntoLines(stdout: string): string[] {
        if (!stdout) {
            return [];
        }

        let lines: string[] = stdout.replace(/\r\n/g, "\n").split("\n");     
        lines = lines.filter((e) => e.trim() !== ""); 
        return lines;
    }
}