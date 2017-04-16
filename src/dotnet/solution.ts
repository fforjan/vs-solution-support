import { Dotnet } from './dotnet';

export class Solution {

    public static ListProjects(solutionFile: string) :Thenable<string[]> {        
        return Dotnet.execute( ["sln", solutionFile ,"list"]).then(result => {
            return Promise.resolve(result.filter( _ => _.endsWith("proj")));
        });
    }
}