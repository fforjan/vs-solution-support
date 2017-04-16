
declare var Viva: any;
declare var projects: string[];
declare var relationShips: {from:string, to:string}[];

// tslint:disable-next-line:no-unused-variable
function onLoad() {

    let graph = Viva.Graph.graph();

    let graphics = Viva.Graph.View.svgGraphics(),
        nodeSize = 24;

    let layout = Viva.Graph.Layout.forceDirected(graph, {
        springLength: 180,
        springCoeff: 0.0005,
        dragCoeff: 0.02,
        gravity: -8
    });

    let renderer = Viva.Graph.View.renderer(graph, {
        graphics: graphics,
        layout: layout
    });
    renderer.run();

    graphics.node(function (node) {
        return Viva.Graph.svg("text")
            .attr("width", nodeSize)
            .attr("height", nodeSize)
            .text(node.id);
    }).placeNode(function (nodeUI, pos) {
        nodeUI.attr("x", pos.x - nodeSize / 2).attr("y", pos.y - nodeSize / 2);
    });

    let createMarker = function (id) {
        return Viva.Graph.svg("marker")
            .attr("id", id)
            .attr("viewBox", "0 0 10 10")
            .attr("refX", "10")
            .attr("refY", "5")
            .attr("markerUnits", "strokeWidth")
            .attr("markerWidth", "10")
            .attr("markerHeight", "5")
            .attr("orient", "auto");
    },

        marker = createMarker("Triangle");
    marker.append("path").attr("d", "M 0 0 L 10 5 L 0 10 z");

    let defs = graphics.getSvgRoot().append("defs");
    defs.append(marker);

    let geom = Viva.Graph.geom();

    graphics.link(function (link) {

        return Viva.Graph.svg("path")
            .attr("stroke", "lime")
            .attr("marker-end", "url(#Triangle)");
    }).placeLink(function (linkUI, fromPos, toPos) {
        let toNodeSize = nodeSize,
            fromNodeSize = nodeSize;

        let from = geom.intersectRect(
            fromPos.x - fromNodeSize / 2, // left
            fromPos.y - fromNodeSize / 2, // top
            fromPos.x + fromNodeSize / 2, // right
            fromPos.y + fromNodeSize / 2, // bottom
            fromPos.x, fromPos.y, toPos.x, toPos.y)
            || fromPos;

        let to = geom.intersectRect(
            toPos.x - toNodeSize / 2, // left
            toPos.y - toNodeSize / 2, // top
            toPos.x + toNodeSize / 2, // right
            toPos.y + toNodeSize / 2, // bottom
            // segment:
            toPos.x, toPos.y, fromPos.x, fromPos.y)
            || toPos;

        let data = "M" + from.x + "," + from.y +
            "L" + to.x + "," + to.y;

        linkUI.attr("d", data);
    });

    // Finally we add something to the graph:
    projects.forEach( (project) => { graph.addNode(project);});
    relationShips.forEach( (relationShip) => { graph.addLink(relationShip.from, relationShip.to); });
}