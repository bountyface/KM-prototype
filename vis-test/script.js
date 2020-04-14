// init nodes
var nodesArray = [
    {
        id: "mainNode:middle",
        label: "Hauptknoten",
        group: "source2",

    },
    {
        id: "mainNode:generalAwarenessRaising",
        label: "General Awareness Raising",
        group: "source1",

    },
    {
        id: "mainNode:genderDrivenDesign",
        label: "Gender Driven Design",
        group: "source1",

    },
    {
        id: "mainNode:mobilityServices",
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
nodes = new vis.DataSet(nodesArray);

var edgesArray = [
    {
        from: "mainNode:middle",
        to: "mainNode:mobilityServices",
    },
    {
        from: "mainNode:middle",
        to: "mainNode:publicTransport",
    },
    {
        from: "mainNode:middle",
        to: "mainNode:employment",
    },
    {
        from: "mainNode:middle",
        to: "mainNode:interestGroups",
    },
    {
        from: "mainNode:middle",
        to: "mainNode:publicCampaigns",
    },
];
edges = new vis.DataSet(edgesArray);

// init edges
function createMainEdges() {
    // erstellt für jeden Node eine Verbindung mit der MainNode
    nodesArray.forEach(node => {
        if (node.id === "mainNode:middle") return;
        edges.add({
            from: "mainNode:middle",
            to: node.id,
        })
    })
    console.log(edges);

}

// create a network at div
var container = document.querySelector('.network');

var data = {
    nodes: nodes,
    edges: edges
};
var options = {
    nodes: {
        shape: 'circle',
        font: {
            //size: 12,
            color: '#ffffff'
        },
        borderWidth: 2,
        scaling: {
            label: {
                min: 12,
                max: 15,
                enabled: true
            }
        },
        physics: true,
        widthConstraint: 100,

    },
    edges: {
        width: 2,
    },
    interaction: {
        dragNodes: false,// do not allow dragging nodes
        zoomView: false, // do not allow zooming
        dragView: false  // do not allow dragging
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

var network = new vis.Network(container, data, options);

createMainEdges();


// Bindings
const addButton = document.getElementById('add');
addButton.addEventListener('click', () => {
    /* todo:    - refresh the network with an updated array of nodes
                - give every node a corresponding spot (x,y)
                - give every node an edge to the main node
     */
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


// Interaction
network.on('click', (obj) => {
    document.querySelector('.report').innerHTML = obj.nodes[0]
});