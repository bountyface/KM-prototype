// init nodes
function createNodesArray() {
    // center node

    switch (mapStartingPoint) {
        case categories:
            nodesArray.push({
                id: "mainNode:middle",
                label: "Categories",
                group: "source1",

            })
            // every other node around the center node
            tagsArray.forEach(tag => {
                nodesArray.push({
                    id: tag.id,
                    label: tag.label,
                    group: "source2"
                })
            })
    }


}

function createMainEdges() {
    // erstellt für jeden Node eine Verbindung mit der MainNode
    nodesArray.forEach(node => {
        if (node.id === "mainNode:middle") return;

        edges.add({
            from: "mainNode:middle",
            to: node.id,
        })

    })

}

function fixNodesPositions() {

    nodes.forEach(node => {
        nodes.update({
            id: node.id, fixed: {
                x: true,
                y: true
            },
        })
    })
}

function growParentEdgeOfNode(nodeId) {
    const edgeId = network.getConnectedEdges(nodeId)

    // getConnectedNodes only returns an array of the connected nodes on the first call
    const parentNode = network.getConnectedNodes(edgeId)[0]

    if (nodeId === "mainNode:middle") return;
    //if (nodes.get(nodeId).group === "source3") return;
    if (!parentNode) return;

    edges.update({
        id: edgeId[0],
        from: parentNode,
        to: nodeId,
        length: 400,
        physics: true,
        fixed: {
            x: false,
            y: false
        },
    })
    nodes.update({
        id: nodeId,
        physics: true,
        fixed: {
            x: false,
            y: false
        },
    })

    network.focus(nodeId, {animation: true})
    // todo:    get the focus on node also when animation is finished
    //          problem:  focus stops earlier than animation has finished
    /*network.on("animationFinished", () => {
        network.focus(nodeId)
    })*/

}

function expandNode(clickedNodeId) {
    const node = nodes.get(clickedNodeId)

    // make edge to parent of selected node longer
    growParentEdgeOfNode(clickedNodeId)

    // position of the clicked node
    const nodeposition = network.getPosition(clickedNodeId)

    let clickedOnTypeOfContent = false;
    let clickedOnTag = false;
    // temporary Array
    let subnodeArray = []

    // find parent of node
    const edgeId = network.getConnectedEdges(clickedNodeId)
    // getConnectedNodes only returns an array of the connected nodes on the first call
    const parentNode = network.getConnectedNodes(edgeId)[0]

    switch (mapStartingPoint) {
        case categories:
            // check if clicked node is part of tagsArray or typeOfContentArrray
            // clicked on typeOfContent?
            if (typeOfContentArray.find(typeOfContent => typeOfContent.id === node.selfNodeId)) {
                articlesArray.forEach(article => {
                    // push every article, that has the type of the clicked node && where the right tag occurs
                    ((article.type === node.selfNodeId) && (article.tags.find(tag => tag === parentNode))) ? subnodeArray.push(article) : null
                })

                clickedOnTypeOfContent = true;
                console.log('clickedOnTypeOfContent', clickedOnTypeOfContent)
            }
            // clicked on tag?
            if (tagsArray.find(tag => tag.id === clickedNodeId)) {
                // cycle through typeOfContents and save every element to the subnode
                // todo: if no articles with according type of Content: type of content node does not show up in the map
                typeOfContentArray.forEach(typeOfContent => {
                    subnodeArray.push(typeOfContent)
                })
                clickedOnTag = true;
                console.log('clickedOnTag', clickedOnTag)
            }
            break;

    }

    // iterate through subnodeArray
    subnodeArray.forEach(subnode => {
        // return, if node is already on the network
        //if (network.findNode(subnode.id).length) return;

        // make a node for each article in subnodeArray
        nodes.add({
                id: subnode.id + "-" + clickedNodeId,
                label: ((mapStartingPoint === categories) && clickedOnTag) ? subnode.label : subnode.title,
                group: clickedOnTag ? "source3" : "source4",
                x: nodeposition.x,
                y: nodeposition.y,
                selfNodeId: subnode.id,
                parentNode: clickedNodeId
            },
        );

        // make an edge from the clicked node to its subnodes
        edges.add({
            from: clickedNodeId,
            to: subnode.id + "-" + clickedNodeId
        },)
    })
}