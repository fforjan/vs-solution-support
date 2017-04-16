import { Dotnet } from "./dotnet";
import * as fs from "fs";

export class Solution {

    public static ListProjects(solutionFile: string) :Thenable<string[]> {        
        return Dotnet.execute( ["sln", solutionFile ,"list"]).then(result => {
            return Promise.resolve(result.filter( _ => _.endsWith("proj")));
        });
    }

    public static ListPlatformAndConfiguration(solutionFile: string) : Thenable<{configuration:string[], platform :string[]}> {

        return new Promise<{configuration:string[], platform :string[]}>( (resolve, reject) => {
            fs.readFile(solutionFile, (err, data) => {
                if(err) {
                    reject(err);
                } else {                    
                    let configuration: { [conf:string] : any}= [];
                    let platform: { [platform:string] : any}= [];

                    let solutionFileLines = data.toString().split("\n");                    

                    // skip the unnecessary data 
                    let readLine:string;
                    do 
                    {
                        readLine = solutionFileLines.shift();
                    }
                    while(readLine.indexOf("SolutionConfigurationPlatforms") === -1);

                    // look for Debug|AnyCPU
                    let regexpForConfAndPlatform = /\s*(.*)\|(.*) =/;
                    readLine = solutionFileLines.shift();
                    do 
                    {                        
                        let match = regexpForConfAndPlatform.exec(readLine);
                        configuration[match[1]] = null;
                        platform[match[2]] = null;
                        readLine = solutionFileLines.shift();
                    }
                    while(readLine.indexOf("EndGlobalSection") === -1);

                    resolve({platform: Object.keys(platform), configuration: Object.keys(configuration)});
                }
            });
        });
    }
}