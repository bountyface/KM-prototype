nodesArray = [];

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

/*
nodesArray = [
    {
        id: "mainNode:middle",
        label: "Hauptknoten",
        group: "source2",


    },
    {
        id: "mainNode:" + generalAwarenessRaising,
        label: "General Awareness Raising",
        group: "source1",

    },
    {
        id: "mainNode:" + genderDrivenDesign,
        label: "Gender Driven Design",
        group: "source1",

    },
    {
        id: "mainNode:" + mobilityServices,
        label: "Mobility Services",
        group: "source1",

    },
    {
        id: "mainNode:publicTransport",
        label: "Public Transport",
        group: "source1",

    },
    {
        id: "mainNode:employment",
        label: "Employment",
        group: "source1",

    },
    {
        id: "mainNode:interestGroups",
        label: "Interest Groups",
        group: "source1",

    },
    {
        id: "mainNode:publicCampaigns",
        label: "Public Campaigns",
        group: "source1",

    },
    {
        id: "mainNode:training",
        label: "Training",
        group: "source1",

    },
    {
        id: "mainNode:education",
        label: "Education",
        group: "source1",

    },
    {
        id: "mainNode:informationPlatform",
        label: "Information Platform",
        group: "source1",

    },
    {
        id: "mainNode:policy",
        label: "Policy",
        group: "source1",

    },
    {
        id: "mainNode:safetyAndSecurity",
        label: "Safety and Security",
        group: "source1",

    },
    {
        id: "mainNode:individualTransport",
        label: "Individual Transport",
        group: "source1",

    },
    {
        id: "mainNode:employmentOfWomenInThePTSector",
        label: "Employment of Women in the PT Sector",
        group: "source1",

    },
    {
        id: "mainNode:equalOpportunities",
        label: "Equal Opportunities",
        group: "source1",

    },
    {
        id: "mainNode:barrierefreiheit",
        label: "Barrierefreiheit",
        group: "source1",

    },
    {
        id: "mainNode:gendergerechteVerkehrsplanung",
        label: "Gendergerechte Verkehrsplanung",
        group: "source1",

    },

];
*/
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
        barnesHut:
            {
                //todo: trial and error
                //avoidOverlap: 0.5,
                //springLength: 250,
            }
    },
    nodes: {
        shape: 'circle',
        font: {
            //size: 12,
            color: '#ffffff'
        },
        chosen: false,
        borderWidth: 2,
        scaling: {
            label: {
                min: 12,
                max: 15,
                enabled: true
            }
        },
        physics: true,
        widthConstraint: 90,
    },
    edges: {
        width: 2,
        length: 250,
    },
    interaction: {
        //dragNodes: false,// do not allow dragging nodes
        //zoomView: false, // do not allow zooming
        //dragView: false  // do not allow dragging
    },
    groups: {
        "source1": {
            color: {
                background: 'red',
                border: 'maroon'
            },
            shadow: {
                enabled: true,
                color: 'rgba(0,0,0,0.5)',
                x: 6,
                y: 6
            }
        },
        "source2": {
            color: {
                background: 'blue',
                border: 'navy'
            },
            shadow: {
                enabled: true,
                color: 'rgba(0,0,0,0.5)',
                x: 6,
                y: 6
            }
        },
    }

};

// create network
var network = new vis.Network(container, data, options);

// init edges
createMainEdges();


// Bindings
const addButton = document.getElementById('add');
addButton.addEventListener('click', () => {
    const id = Math.random();
    nodes.add({
            id: "mainNode:addedNode" + id,
            label: "Added Node",
            group: "source1",

        },
    );
    edges.add({
        from: "mainNode:middle",
        to: "mainNode:addedNode" + id,
    },)

});

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

function expandNode(clickedNodeId) {
    console.log("clickedNodeId: ", clickedNodeId)
    // todo: make edge to parent of selected node longer

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
                group: "source1",
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
    network.focus(clickedNodeId, {animation: true})

}

// Interaction
network.on('click', (obj) => {
    document.querySelector('.report').innerHTML = obj.nodes[0]

    if (obj.nodes.length) { // Did the click occur on a node?
        const clickedNodeId = obj.nodes[0]; // The id of the node clicked
        expandNode(clickedNodeId);
        // todo: function, that gives multiple edges to other nodes, according to tags of articles
    }

});