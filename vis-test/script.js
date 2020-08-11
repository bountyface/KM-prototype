const nodesArray = [];
const edgesArray = [];
const edgeColor = "rgba(50,77,137,1)";
const selectEdgeColor = "rgba(235,220,21, 1)";
const categories = "categories";
const contentType = "contentType";
const region = "region";
let mapStartingPoint = categories;

let nodes;
let edges;
let network;

// radiobutton categories activated by default
document.getElementById("categories").checked = true;

// init the first view

//create nodesArray from data
createNodesArray();

// Interaction

if (network) {
	network.on("click", (obj) => {
		if (!obj.nodes[0]) return;
		// show content on the right side
		//document.querySelector('.report').innerHTML = obj.nodes[0]

		if (obj.nodes.length) {
			// Did the click occur on a node?
			const clickedNodeId = obj.nodes[0]; // The id of the node clicked
			// check if nodeId belongs to an article (online number ids for articles)
			const clickedNode = nodes.get(clickedNodeId);
			if (Number.isInteger(clickedNode.selfNodeId)) {
				const article = articlesArray.find(
					(article) => article.id === clickedNode.selfNodeId
				);
				document.querySelector(".report").innerHTML = JSON.stringify(article);
			}
			// check if node is already expanded if not
			nodes.get(clickedNodeId).expanded
				? collapseNode(clickedNodeId)
				: expandNode(clickedNodeId);
		}
	});

	network.on("stabilizationIterationsDone", function () {
		console.log("stabilized");
		//fixNodesPositions();
	});
}
