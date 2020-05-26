const nodesArray = [];
const edgesArray = [];
const edgeColor = 'rgb(255,203,0)'
const selectEdgeColor = 'rgb(55,255,0)'

const categories = "categories"
const contentType = "contentType"
const language = "language"
let mapStartingPoint = categories

let nodes;
let edges;
let network;

// radiobutton categories activated by default
document.getElementById("categories").checked = true;

// init the first view

//create nodesArray from data
createNodesArray()


// Interaction

if (network) {
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


            // todo: collapse node on second click
        }

    });

    network.on("stabilizationIterationsDone", function () {
        console.log('stabilized')
        fixNodesPositions();
    });

}