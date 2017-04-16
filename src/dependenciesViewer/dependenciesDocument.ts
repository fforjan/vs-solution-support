'use strict';

import * as vscode from 'vscode';
import * as path from 'path';
import {Solution} from '../dotnet/solution';
import {Project} from '../dotnet/project';
export class DependenciesDocument {
    _emitter: any;
    _uri:  vscode.Uri;

    private static filenameWithoutExtension(filePath: string) {
        return path.basename(filePath, path.extname(filePath));
    }

    private static onlyName(dependency : {from: string, to: string}): {from: string, to: string} {
        dependency.from = DependenciesDocument.filenameWithoutExtension(dependency.from);
        dependency.to = DependenciesDocument.filenameWithoutExtension(dependency.to);
        return dependency;
    }

    constructor(uri: vscode.Uri, emitter: vscode.EventEmitter<vscode.Uri>) {
        this._uri = uri;

        // The ReferencesDocument has access to the event emitter from
        // the containg provider. This allows it to signal changes
        this._emitter = emitter;
    }

    get projects(): Thenable<string[]> {        
        return Solution.ListProjects(this._uri.query).then(
            projects => Promise.resolve( projects.map(_ => DependenciesDocument.filenameWithoutExtension(_) ) )
         );
    }

    get relationShips(): Thenable<{from: string, to: string}[]> {        
        let solutionFolder = path.dirname(this._uri.query);
        return Solution.ListProjects(this._uri.query).then((projects) => {
            
            return Promise.all(
                projects.map( project=> Project.ListProjectReferences(path.join(solutionFolder, project)).then(references =>
                  Promise.resolve(references.map<{from: string, to: string}>( (_) => <{from: string, to: string}>{ from: project, to: _} ))))).then(
                        (projectsDependencies) => {
                            let result : {from: string, to: string}[] = [];
                            for(let projectDependencies of projectsDependencies) {
                                result = result.concat(projectDependencies);
                            }            
                            return result.map( _ => DependenciesDocument.onlyName(_) );
                        }
                        
                 );            
        })
    }

    get value() : Thenable<string> {
        return Promise.all([this.relationShips, this.projects]).then((info) =>         
        Promise.resolve(`<html> <head>
        <title>VivaGraphs test page</title>
        <script src="https://anvaka.github.io/VivaGraphJS/dist/vivagraph.js"></script>
        <script type='text/javascript'>
                  function onLoad() {
            
            var relationShips = ${JSON.stringify(info[0])};
            var projects = ${JSON.stringify(info[1])};
             var graph = Viva.Graph.graph();

var graphics = Viva.Graph.View.svgGraphics(),
nodeSize = 24;

var renderer = Viva.Graph.View.renderer(graph, {
    graphics : graphics
});
renderer.run();

graphics.node(function(node) {
    return Viva.Graph.svg('text')
        .attr('width', nodeSize)
        .attr('height', nodeSize)
        .text(node.id);
    }).placeNode(function(nodeUI, pos) {
        nodeUI.attr('x', pos.x - nodeSize / 2).attr('y', pos.y - nodeSize / 2);
});

var createMarker = function(id) {
        return Viva.Graph.svg('marker')
                .attr('id', id)
                .attr('viewBox', "0 0 10 10")
                .attr('refX', "10")
                .attr('refY', "5")
                .attr('markerUnits', "strokeWidth")
                .attr('markerWidth', "10")
                .attr('markerHeight', "5")
                .attr('orient', "auto");
},

marker = createMarker('Triangle');
marker.append('path').attr('d', 'M 0 0 L 10 5 L 0 10 z');

var defs = graphics.getSvgRoot().append('defs');
defs.append(marker);

var geom = Viva.Graph.geom();

graphics.link(function(link){
       
    return Viva.Graph.svg('path')
        .attr('stroke', 'lime')
        .attr('marker-end', 'url(#Triangle)');
    }).placeLink(function(linkUI, fromPos, toPos) {
        var toNodeSize = nodeSize,
        fromNodeSize = nodeSize;

        var from = geom.intersectRect(
            fromPos.x - fromNodeSize / 2, // left
            fromPos.y - fromNodeSize / 2, // top
            fromPos.x + fromNodeSize / 2, // right
            fromPos.y + fromNodeSize / 2, // bottom
            fromPos.x, fromPos.y, toPos.x, toPos.y)
        || fromPos;

        var to = geom.intersectRect(
            toPos.x - toNodeSize / 2, // left
            toPos.y - toNodeSize / 2, // top
            toPos.x + toNodeSize / 2, // right
            toPos.y + toNodeSize / 2, // bottom
            // segment:
            toPos.x, toPos.y, fromPos.x, fromPos.y)
            || toPos;

        var data = 'M' + from.x + ',' + from.y +
            'L' + to.x + ',' + to.y;

        linkUI.attr("d", data);
    });

// Finally we add something to the graph:
projects.forEach(function(project) {graph.addNode(project ) } );
relationShips.forEach(function(relationShip) {graph.addLink(relationShip.from, relationShip.to ) } );
            }            
        </script>
         <style type='text/css'>html, body, svg { width: 100%; height: 100%; background-color: white} </style>
    </head>
    <body onload="onLoad()">    </body></html>`));
    };
}