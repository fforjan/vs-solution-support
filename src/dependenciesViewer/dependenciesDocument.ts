/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
'use strict';

import * as vscode from 'vscode';

export class DependenciesDocument {
    _emitter: any;
    _uri: any;

	constructor(uri: vscode.Uri, emitter: vscode.EventEmitter<vscode.Uri>) {
		this._uri = uri;

		// The ReferencesDocument has access to the event emitter from
		// the containg provider. This allows it to signal changes
		this._emitter = emitter;		
	}

    get value() {
		return `<html> <head>
        <title>VivaGraphs test page</title>
        <script src="https://anvaka.github.io/VivaGraphJS/dist/vivagraph.js"></script>
        <script type='text/javascript'>
                  function onLoad() {
             var graph = Viva.Graph.graph();

var graphics = Viva.Graph.View.svgGraphics(),
nodeSize = 24;

var renderer = Viva.Graph.View.renderer(graph, {
    graphics : graphics
});
renderer.run();

graphics.node(function(node) {
    return Viva.Graph.svg('image')
        .attr('width', nodeSize)
        .attr('height', nodeSize)
        .link('https://secure.gravatar.com/avatar/' + node.data);
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
    var label = Viva.Graph.svg('text').attr('id','label_'+link.data.id).text(link.data.id);
            	        graphics.getSvgRoot().childNodes[0].append(label);
    
    return Viva.Graph.svg('path')
        .attr('stroke', 'gray')
        .attr('marker-end', 'url(#Triangle)')
        .attr('id', link.data.id);
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
    
        document.getElementById('label_'+linkUI.attr('id'))
                	.attr("x", (from.x + to.x) / 2)
                	.attr("y", (from.y + to.y) / 2);
    });

// Finally we add something to the graph:
graph.addNode('anvaka', '91bad8ceeec43ae303790f8fe238164b');
graph.addNode('indexzero', 'd43e8ea63b61e7669ded5b9d3c2e980f');
graph.addNode('test', 'd43e8ea63b61e7669ded5b9d3c2e980f');
graph.addLink('anvaka', 'indexzero', {id : 1});
graph.addLink('anvaka', 'test', {id : 2});
            }            
        </script>
         <style type='text/css'>html, body, svg { width: 100%; height: 100%;} </style>
    </head>
    <body onload="onLoad()">
        <div id="graph-container" width='1000px' height='1000px' ></div>
    </body></html>`;
	}
}