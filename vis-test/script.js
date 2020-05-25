const nodesArray = [];
const edgesArray = [];
const edgeColor = 'rgb(255,203,0)'
const selectEdgeColor = 'rgb(55,255,0)'

const categories = "categories"
const contentType = "contentType"
const language = "language"
const mapStartingPoint = categories

// radiobutton categories activated by default
document.getElementById("categories").checked = true;

// init the first view

//create nodesArray from data
createNodesArray()

const nodes = new vis.DataSet(nodesArray);
const edges = new vis.DataSet(edgesArray);

// init edges
createMainEdges();

// create a network at div
const container = document.querySelector('.network');

const data = {
    nodes: nodes,
    edges: edges
};
const options = {
    layout: {randomSeed: 2},
    physics: {
        barnesHut: {gravitationalConstant: -20000},
        stabilization: {
            iterations: 150
        }
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
        "source2": {
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
const network = new vis.Network(container, data, options);


// Interaction
network.on('click', (obj) => {
    if (!obj.nodes[0]) return;
    // show content on the right side
    //document.querySelector('.report').innerHTML = obj.nodes[0]

    if (obj.nodes.length) { // Did the click occur on a node?
        const clickedNodeId = obj.nodes[0]; // The id of the node clicked
        // check if nodeId belongs to an article (online number ids for articles)
        const clickedNode = nodes.get(clickedNodeId)
        if (Number.isInteger(clickedNode.selfNodeId)) {
            const article = articlesArray.find(article => article.id === clickedNode.selfNodeId)
            document.querySelector('.report').innerHTML = JSON.stringify(article)
        }
        expandNode(clickedNodeId);
        // todo: function, that gives multiple edges to other nodes, according to tags of articles
    }

});

network.on("stabilizationIterationsDone", function () {
    console.log('stabilized')
    fixNodesPositions();
});

