const nodesArray = [];
const edgeColor = 'rgb(255,203,0)'
const selectEdgeColor = 'rgb(55,255,0)'

// init nodes


function createNodesArray() {
    // center node
    nodesArray.push({
        id: "mainNode:middle",
        label: "Hauptknoten",
        group: "source2",

    })

    // every other node around the center node
    tagsArray.forEach(tag => {
        nodesArray.push({
            id: tag.id,
            label: tag.label,
            group: "source1"
        })
    })
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

createNodesArray()

nodes = new vis.DataSet(nodesArray);
var edgesArray = [];
edges = new vis.DataSet(edgesArray);

// create a network at div
var container = document.querySelector('.network');

var data = {
    nodes: nodes,
    edges: edges
};
var options = {
    layout: {randomSeed: 2},
    physics: {
        barnesHut: {gravitationalConstant: -20000},
        stabilization: {
            iterations: 150
        }

        /*barnesHut:
            {
                //todo: trial and error
                //avoidOverlap: 0.1,
                springLength: 250,
                gravitationalConstant: -10000,
                springConstant: 1
            }*/

    },

    nodes: {
        chosen: false,

        font: {
            //size: 12,
            color: '#000000',
        },
        borderWidth: 2,
        scaling: {
            min: 50,
            max: 80,

            label: {
                min: 12,
                max: 17,
                enabled: true
            }
        },
        shape: 'circle',
        physics: true,
        widthConstraint: 90,
    },
    edges: {
        width: 2,
        //length: 250,
        color: {
            color: edgeColor,
        },
        chosen: {
            label: false,
            edge: (values, id, selected, hovering) => {
                values.color = edgeColor;
                values.width = 3
            }
        }

    },
    interaction: {

        dragNodes: false,// do not allow dragging nodes
        //zoomView: false, // do not allow zooming
        //dragView: false  // do not allow dragging
    },
    groups: {
        "source1": {
            color: {
                background: 'rgb(175,234,100)',
                border: 'maroon'
            },
            shadow: {
                enabled: true,
                color: 'rgba(0,0,0,0.5)',
                x: 6,
                y: 6
            },
            value: 5,


        },
        "source2": {
            color: {
                background: 'rgba(42,228,255,1)',
                border: 'navy'
            },
            shadow: {
                enabled: true,
                color: 'rgba(0,0,0,0.5)',
                x: 6,
                y: 6
            },
            value: 10,
            interaction: {
                //dragNodes: false, // do not allow dragging node
                //
            }

        },
        "source3": {
            font: {
                color: "#000000"
            },
            color: {
                background: '#ffbf00',
                border: 'navy'
            },
            shadow: {
                enabled: true,
                color: 'rgba(0,0,0,0.5)',
                x: 6,
                y: 6
            },
            // if changed, sizing error onclick occurs
            value: 2,

        },
    }

};

// create network
var network = new vis.Network(container, data, options);

// init edges
createMainEdges();


function fixNodesPositions() {

    nodes.forEach(node => {
        nodes.update({
            id: node.id, fixed: {
                x: true,
                y: true
            },
        })
    })
    console.log("all nodes", nodes.get());
}

// --- Bindings

const addToPublicTransportButton = document.getElementById('addToPublicTransport');
let counter = 1;
addToPublicTransportButton.addEventListener('click', () => {
    const nodeposition = network.getPosition("publicTransport")

    const id = Math.random();
    nodes.add({
            id: "subNode:addedToPublicTransport" + id,
            label: "Subnode " + counter,
            group: "source1",
            x: nodeposition.x,
            y: nodeposition.y

        },
    );
    edges.add({
        from: "mainNode:publicTransport",
        to: "subNode:addedToPublicTransport" + id,
    },)
    network.focus("mainNode:publicTransport", {animation: true})
    counter = counter + 1;
});
const focusOnPublicTransportButton = document.getElementById("focusOnPublicTransport");
focusOnPublicTransportButton.addEventListener('click', () => {
    network.focus(publicTransport, {animation: true})
})

// --- end bindings

function growParentEdgeOfNode(nodeId) {
    const edgeId = network.getConnectedEdges(nodeId)
    console.log('node', nodes.get(nodeId))
    if (nodeId === "mainNode:middle") return;
    if (nodes.get(nodeId).group === "source3") return;

    edges.update({
        id: edgeId[0],
        from: "mainNode:middle",
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
    console.log("clickedNodeId: ", clickedNodeId)
    // todo: make edge to parent of selected node longer
    growParentEdgeOfNode(clickedNodeId)

    // position of the clicked node
    const nodeposition = network.getPosition(clickedNodeId)
    // temporary Array
    let subnodeArray = []

    // cycle through articles array, find every article with tag of clicked node
    articlesArray.forEach(article => {
        // save every article belonging to the clickedNodeId to the subnodeArray
        article.tags.find(tag => tag === clickedNodeId) ? subnodeArray.push(article) : null;
    })
    console.log("subnodeArray", subnodeArray)

    // iterate through subnodeArray
    subnodeArray.forEach(subnode => {
        // return, if node is already on the network
        if (network.findNode(subnode.id).length) return;

        // make a node for each article in subnodeArray
        nodes.add({
                id: subnode.id,
                label: subnode.title,
                group: "source3",
                x: nodeposition.x,
                y: nodeposition.y
            },
        );

        // make an edge from the clicked node to its subnodes
        edges.add({
            from: clickedNodeId,
            to: subnode.id
        },)
    })

    // set focus to clicked Node
    //network.focus(clickedNodeId, {animation: true})

}

// Interaction
network.on('click', (obj) => {
    if (!obj.nodes[0]) return;
    // show content on the right side

    //document.querySelector('.report').innerHTML = obj.nodes[0]


    if (obj.nodes.length) { // Did the click occur on a node?
        const clickedNodeId = obj.nodes[0]; // The id of the node clicked
        // check if nodeId belongs to an article (online number ids for articles)
        if (Number.isInteger(clickedNodeId)) {
            const article = articlesArray.find(article => article.id === clickedNodeId)
            document.querySelector('.report').innerHTML = JSON.stringify(article)
        }
        expandNode(clickedNodeId);
        // todo: function, that gives multiple edges to other nodes, according to tags of articles
    }

});

network.on("stabilizationIterationsDone", function () {
    console.log('stabilized')
    fixNodesPositions();
    /*network.setOptions({
        groups: {
            "source1": {
                fixed: {
                    x: true,
                    y: true
                },
            }
        }
    });*/
});
/*

network.on("stabilized", function () {
    console.log('stabilized')
    network.setOptions({
        nodes: {
            physics: false
        },
        edges: {
            physics: false
        }
    })
})
 */

