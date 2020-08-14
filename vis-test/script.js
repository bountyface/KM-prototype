const nodesArray = [];
const edgesArray = [];
const edgeColor = "rgba(50,77,137,1)";
const selectColor = "rgba(235,220,21, 1)";
const gd_goal = "gd_goal";
const outcome = "outcome";
const field = "field";
const section = "section";
const content_type = "content_type";
let mapStartingPoint = gd_goal;

const edgeWidthOnSelect = 6;

let nodes;
let edges;
let network;

// radiobutton categories activated by default
document.getElementById("gd_goal_radio").checked = true;

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
			parentId = nodes.get(clickedNodeId).parentNode;
			if (parentId) {
				parent = nodes.get(parentId);

				console.log(parent);
				console.log("connected edges", network.getConnectedEdges(parentId));
				// parent edge
				parentEdgeId = network.getConnectedEdges(parentId)[0];

				nodes.update({
					id: parentId,
					color: { background: selectColor },
				});

				edges.update({
					id: parentEdgeId,
					color: selectColor,
					width: edgeWidthOnSelect,
				});
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
