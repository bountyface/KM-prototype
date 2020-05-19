const nodesArray = [];
const edgeColor = 'rgb(255,203,0)'
const selectEdgeColor = 'rgb(55,255,0)'

const categories = "categories"
const contentType = "contentType"
const language = "language"

const mapStartingPoint = categories
// radiobutton categories activated by default
document.getElementById("categories").checked = true;


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
        "source4": {
            font: {
                color: "#000000"
            },
            color: {
                background: '#ef3737',
                border: 'navy'
            },
            shadow: {
                enabled: true,
                color: 'rgba(0,0,0,0.5)',
                x: 6,
                y: 6
            },
            // if changed, sizing error onclick occurs
            value: 1,

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

const submitButton = document.getElementById("submit");
submitButton.addEventListener('click', () => {
    // radio button selection

    if (document.getElementById("categories").checked === true) {
        console.log('categories checked')
    }
    if (document.getElementById("contentType").checked === true) {
        console.log('contentType checked')
    }
    if (document.getElementById("language").checked === true) {
        console.log('language checked')
    }
})

const focusOnPublicTransportButton = document.getElementById("focusOnPublicTransport");
focusOnPublicTransportButton.addEventListener('click', () => {
    network.focus(publicTransport, {animation: true})
})

// --- end bindings

function growParentEdgeOfNode(nodeId) {
    const edgeId = network.getConnectedEdges(nodeId)

    // getConnectedNodes only returns an array of the connected nodes on the first call
    const parentNode = network.getConnectedNodes(edgeId)[0]

    console.log('getConnectedNodes', parentNode)
    //console.log('nodes', nodes.get())
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

    // make edge to parent of selected node longer
    growParentEdgeOfNode(clickedNodeId)

    // position of the clicked node
    const nodeposition = network.getPosition(clickedNodeId)

    let clickedOnTypeOfContent = null;
    let clickedOnTag = null;
    // temporary Array
    let subnodeArray = []

    switch (mapStartingPoint) {
        case "categories":
            // check if clicked node is part of tagsArray or typeOfContentArrray
            // clicked on typeOfContent?
            if (typeOfContentArray.find(typeOfContent => typeOfContent.id === clickedNodeId)) {

                // find parent of node
                const edgeId = network.getConnectedEdges(clickedNodeId)
                // getConnectedNodes only returns an array of the connected nodes on the first call
                const parentNode = network.getConnectedNodes(edgeId)[0]

                articlesArray.forEach(article => {
                    // push every article, that has the type of the clicked node && where the right tag occurs
                    ((article.type === clickedNodeId) && (article.tags.find(tag => tag === parentNode))) ? subnodeArray.push(article) : null
                })
                console.log("if1")
                clickedOnTypeOfContent = true;
            }
            // clicked on tag?
            if (tagsArray.find(tag => tag.id === clickedNodeId)) {
                // cycle through typeOfContents and save every element to the subnode
                // todo: if no articles with accdording type of Content: type of content node does not show up in the map
                typeOfContentArray.forEach(typeOfContent => {
                    subnodeArray.push(typeOfContent)
                })
                clickedOnTag = true;
                console.log("if2")
            }
            break;

    }
    /*
        // cycle through articles array, find every article with tag of clicked node
        articlesArray.forEach(article => {
            // save every article belonging to the clickedNodeId to the subnodeArray
            article.tags.find(tag => tag === clickedNodeId) ? subnodeArray.push(article) : null;
        })

     */
    console.log("subnodeArray", subnodeArray)

    // iterate through subnodeArray
    subnodeArray.forEach(subnode => {
        // return, if node is already on the network
        if (network.findNode(subnode.id).length) return;

        // make a node for each article in subnodeArray
        nodes.add({
                id: subnode.id,
                label: ((mapStartingPoint === categories) && clickedOnTag) ? subnode.label : subnode.title,
                group: clickedOnTag ? "source3" : "source4",
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

