// init nodes
function createKnowledgeMap() {
	// center node

	// creates nodesArray according to selected mapStartingPoint and delivers
	// it to initMap()
	switch (mapStartingPoint) {
		case gd_goal:
			console.log("case gd_goal");
			createMapStartingPoint("Gender & Diversity Goal", gd_goalArray);
			break;
		case outcome:
			console.log("case field");
			createMapStartingPoint("Outcome", outcomeArray);
			break;
		case field:
			console.log("case field");
			createMapStartingPoint("Field", fieldArray);
			break;

		case section:
			console.log("case section");
			createMapStartingPoint("Section", sectionArray);
			break;

		case content_type:
			console.log("case content_type");
			createMapStartingPoint("Content Type", content_typeArray);
			break;
	}
}

function createMainEdges(array) {
	// erstellt für jeden Node eine Verbindung mit der MainNode
	array.forEach((node) => {
		if (node.id === "mainNode:middle") return;

		edges.add({
			from: "mainNode:middle",
			to: node.id,
		});
	});
}
function createMapStartingPoint(label, array) {
	const nodesArray = [];
	nodesArray.push({
		id: "mainNode:middle",
		label: label,
		pathlabel: label,
		group: "source1",
	});
	// every other node around the center node
	array.forEach((element) => {
		nodesArray.push({
			id: element.id,
			label: element.label,
			pathlabel: element.label,
			path: label + " - " + element.label,
			group: "source2",
			expanded: false,
			color: "#FFFFFF",
		});
	});
	initMap(nodesArray, edgesArray);

	// add numbers
	array.forEach((element) => {
		let numberOfArticles = filterArticles(element.id).length;

		nodes.update({
			id: element.id,
			label: element.label + "\n(" + numberOfArticles + ")",
		});
	});
}

function fixNodesPositions() {
	nodes.forEach((node) => {
		nodes.update({
			id: node.id,
			fixed: {
				x: true,
				y: true,
			},
		});
	});
}

function growParentEdgeOfNode(nodeId) {
	const edgeId = network.getConnectedEdges(nodeId);

	// getConnectedNodes only returns an array of the connected nodes on the first call
	const parentNode = network.getConnectedNodes(edgeId)[0];

	if (nodeId === "mainNode:middle") return;
	//if (nodes.get(nodeId).group === "source3") return;
	if (!parentNode) return;

	edges.update({
		id: edgeId[0],
		from: parentNode,
		to: nodeId,
		//length: edgeLengthExpanded,
		physics: true,
		fixed: {
			x: false,
			y: false,
		},
	});

	nodes.update({
		id: nodeId,
		physics: true,
		fixed: {
			x: false,
			y: false,
		},
	});
	network.focus(nodeId, { animation: true });

	// todo:    get the focus on node also when animation is finished
	//          problem:  focus stops earlier than animation has finished
	/*network.on("animationFinished", () => {
        network.focus(nodeId)
    })*/
}

function expandNode(clickedNodeId) {
	const node = nodes.get(clickedNodeId);
	// set origin position into array to collapse it later
	const nodePosition = network.getPosition(clickedNodeId);

	nodes.update({
		id: clickedNodeId,
		expanded: true,
	});

	// make edge to parent of selected node longer
	growParentEdgeOfNode(clickedNodeId);
	
	let subnodeArray = [];

	// assign group of subnode to right value according to node clicked

	switch (mapStartingPoint) {
		case gd_goal:
			// clicked on gd_goal element?
			if (gd_goalArray.find((element) => element.id === clickedNodeId)) {
				sectionArray.forEach((section) => {
					subnodeArray.push(section);
				});
				applySubnodeArrayToNetwork(subnodeArray, clickedNodeId);
				showNumberOfArticlesOnSubnode(clickedNodeId);
			}

			// clicked on section?
			if (sectionArray.find((element) => element.id === node.selfNodeId)) {
				content_typeArray.forEach((content_type) => {
					subnodeArray.push(content_type);
				});
				applySubnodeArrayToNetwork(subnodeArray, clickedNodeId);
				showNumberOfArticlesOnSubnode(clickedNodeId);
			}

			// clicked on content_type?
			if (content_typeArray.find((element) => element.id === node.selfNodeId)) {
				nodes.update({
					id: clickedNodeId,
					path: nodes.get(clickedNodeId).path,
				});
			}
			break;

		case outcome:
			// clicked on outcome?
			if (outcomeArray.find((outcome) => outcome.id === node.id)) {
				fieldArray.forEach((field) => {
					subnodeArray.push(field);
				});
				applySubnodeArrayToNetwork(subnodeArray, clickedNodeId);
				showNumberOfArticlesOnSubnode(clickedNodeId);
			}
			// clicked on field?
			if (fieldArray.find((field) => field.id === node.selfNodeId)) {
				sectionArray.forEach((section) => {
					subnodeArray.push(section);
				});
				applySubnodeArrayToNetwork(subnodeArray, clickedNodeId);
				showNumberOfArticlesOnSubnode(clickedNodeId);
			}

			// clicked on section?
			if (sectionArray.find((element) => element.id === node.selfNodeId)) {
				let selfPathLabel = nodes.get(clickedNodeId).pathlabel;
				nodes.update({
					id: clickedNodeId,
					path: nodes.get(clickedNodeId).path,
				});
			}
			break;

		case field:
			// clicked on field?
			if (fieldArray.find((field) => field.id === node.id)) {
				sectionArray.forEach((section) => {
					subnodeArray.push(section);
				});
				applySubnodeArrayToNetwork(subnodeArray, clickedNodeId);
				showNumberOfArticlesOnSubnode(clickedNodeId);
			}

			// clicked on section?
			if (sectionArray.find((section) => section.id === node.selfNodeId)) {
				content_typeArray.forEach((content_type) => {
					subnodeArray.push(content_type);
				});
				applySubnodeArrayToNetwork(subnodeArray, clickedNodeId);
				showNumberOfArticlesOnSubnode(clickedNodeId);
			}

			// clicked on content_type?
			if (content_typeArray.find((element) => element.id === node.selfNodeId)) {
				let selfPathLabel = nodes.get(clickedNodeId).pathlabel;
				nodes.update({
					id: clickedNodeId,
					path: nodes.get(clickedNodeId).path,
				});
			}
			break;

		case section:
			// clicked on section?
			if (sectionArray.find((section) => section.id === node.id)) {
				fieldArray.forEach((field) => {
					subnodeArray.push(field);
				});
				applySubnodeArrayToNetwork(subnodeArray, clickedNodeId);
				showNumberOfArticlesOnSubnode(clickedNodeId);
			}
			// clicked on field?
			if (fieldArray.find((section) => section.id === node.selfNodeId)) {
				outcomeArray.forEach((outcome) => {
					subnodeArray.push(outcome);
				});
				applySubnodeArrayToNetwork(subnodeArray, clickedNodeId);
				showNumberOfArticlesOnSubnode(clickedNodeId);
			}
			// clicked on content_type?
			if (outcomeArray.find((element) => element.id === node.selfNodeId)) {
				let selfPathLabel = nodes.get(clickedNodeId).pathlabel;
				nodes.update({
					id: clickedNodeId,
					path: nodes.get(clickedNodeId).path,
				});
			}
			break;

		case content_type:
			// clicked on content_type?
			if (
				content_typeArray.find((content_type) => content_type.id === node.id)
			) {
				fieldArray.forEach((field) => {
					subnodeArray.push(field);
				});
				applySubnodeArrayToNetwork(subnodeArray, clickedNodeId);
				showNumberOfArticlesOnSubnode(clickedNodeId);
			}

			// clicked on field?
			if (fieldArray.find((field) => field.id === node.selfNodeId)) {
				sectionArray.forEach((section) => {
					subnodeArray.push(section);
				});
				applySubnodeArrayToNetwork(subnodeArray, clickedNodeId);
				showNumberOfArticlesOnSubnode(clickedNodeId);
			}

			// clicked on section?
			if (sectionArray.find((element) => element.id === node.selfNodeId)) {
				let selfPathLabel = nodes.get(clickedNodeId).pathlabel;
				nodes.update({
					id: clickedNodeId,
					path: nodes.get(clickedNodeId).path,
				});
			}
			break;
	}
}

function applySubnodeArrayToNetwork(subnodeArray, clickedNodeId) {
	// iterate through subnodeArray
	subnodeArray.forEach((subnode) => {
		// return, if node is already on the network
		// make a node for each article in subnodeArray
		nodes.add({
			id: subnode.id + "-" + clickedNodeId,
			label: subnode.label,
			pathlabel: subnode.label,
			group: "source2",
			selfNodeId: subnode.id,
			parentNode: clickedNodeId,
			color: "#FFFFFF",
			path: nodes.get(clickedNodeId).path + " - " + subnode.label,
		}),
			// make an edge from the clicked node to its subnodes
			edges.add({
				from: clickedNodeId,
				to: subnode.id + "-" + clickedNodeId,
			});
	});
}

function collapseNode(nodeId) {
	if (nodeId === "mainNode:middle") return;

	const edgeId = network.getConnectedEdges(nodeId);

	// getConnectedNodes only returns an array of the connected nodes on the first call
	const parentNode = network.getConnectedNodes(edgeId)[0];

	edges.update({
		id: edgeId[0],
		length: edgeLength,
		physics: true,
		fixed: {
			x: false,
			y: false,
		},
	});
	nodes.update({
		id: nodeId,
		physics: true,
		fixed: {
			x: false,
			y: false,
		},
		expanded: false,
	});

	// destroy all the other edges and nodes and their children, except mainEdge
	nodesToBeRemoved = [];
	edgesToBeRemoved = [];
	nodes.get().forEach((node) => {
		if (node.parentNode === nodeId) {
			nodesToBeRemoved.push(node);
			edgesToBeRemoved.push(network.getConnectedEdges(node.id)[0]);
		}
	});

	nodes.remove(nodesToBeRemoved);
	edges.remove(edgesToBeRemoved);

	// remove nodes with no edge on the map
	nodes.get().forEach((node) => {
		if (!network.getConnectedEdges(node.id)[0]) {
			nodes.remove(node.id);
		}
	});

	// remove edges with no node on the map
	edges.get().forEach((edge) => {
		if (!network.getConnectedNodes(edge.id)[0]) {
			edges.remove(edge.id);
		}
	});
}
function highlightPath(nodeId) {
	parentNodeId = nodes.get(nodeId).parentNode;
	if (parentNodeId) {
		parent = nodes.get(parentNodeId);
		// parent edge
		const parentEdgeId = network.getConnectedEdges(parentNodeId)[0];

		// check if node has grandParent node
		if (nodes.get(parentNodeId).parentNode) {
			const grandParentId = nodes.get(parentNodeId).parentNode;
			network.setSelection(
				{
					nodes: [nodeId, parentNodeId, grandParentId],
					edges: [
						network.getConnectedEdges(nodeId)[0],
						parentEdgeId,
						network.getConnectedEdges(grandParentId)[0],
					],
				},
				{
					highlightEdges: false,
				}
			);
		} else {
			network.setSelection(
				{
					nodes: [nodeId, parentNodeId],
					edges: [network.getConnectedEdges(nodeId)[0], parentEdgeId],
				},
				{
					highlightEdges: false,
				}
			);
		}
	}
}
function filterArticles(nodeId) {
	node = nodes.get(nodeId);
	let filteredArticles = [];
	// get articles for:

	// - self
	if (!node.parentNode) {
		//console.log("ich bin level 1");

		switch (mapStartingPoint) {
			case gd_goal:
				if (gd_goalArray.find((gd_goal) => gd_goal.id === nodeId)) {
					filteredArticles = articlesArray.filter(
						(article) => article.gd_goal === nodeId
					);
				}
				break;
			case outcome:
				if (outcomeArray.find((outcome) => outcome.id === nodeId)) {
					filteredArticles = articlesArray.filter(
						(article) => article.outcome === nodeId
					);
				}

			case field:
				if (fieldArray.find((field) => field.id === nodeId)) {
					filteredArticles = articlesArray.filter(
						(article) => article.field === nodeId
					);
				}
				break;
			case section:
				if (sectionArray.find((section) => section.id === nodeId)) {
					filteredArticles = articlesArray.filter(
						(article) => article.section === nodeId
					);
				}
				break;

			case content_type:
				if (
					content_typeArray.find((content_type) => content_type.id === nodeId)
				) {
					filteredArticles = articlesArray.filter(
						(article) => article.content_type === nodeId
					);
				}
				break;
			default:
				break;
		}
	}
	// - self and parent
	if (node.parentNode && !nodes.get(node.parentNode).parentNode) {
		switch (mapStartingPoint) {
			case gd_goal:
				if (sectionArray.find((section) => section.id === node.selfNodeId)) {
					filteredArticles = articlesArray.filter(
						(article) =>
							article.gd_goal === node.parentNode &&
							article.section === node.selfNodeId
					);
				}
				break;
			case outcome:
				if (fieldArray.find((field) => field.id === node.selfNodeId)) {
					filteredArticles = articlesArray.filter((article) => {
						return (
							article.outcome === node.parentNode &&
							article.field === node.selfNodeId
						);
					});
				}
				break;
			case field:
				if (sectionArray.find((section) => section.id === node.selfNodeId)) {
					filteredArticles = articlesArray.filter(
						(article) =>
							article.field === node.parentNode &&
							article.section === node.selfNodeId
					);
				}
				break;

			case section:
				if (fieldArray.find((field) => field.id === node.selfNodeId)) {
					filteredArticles = articlesArray.filter(
						(article) =>
							article.section === node.parentNode &&
							article.field === node.selfNodeId
					);
				}
				break;
			case content_type:
				if (fieldArray.find((field) => field.id === node.selfNodeId)) {
					filteredArticles = articlesArray.filter(
						(article) =>
							article.content_type === node.parentNode &&
							article.field === node.selfNodeId
					);
				}
				break;
			default:
				break;
		}
	}
	// - self, parent and grandparentnode
	if (node.parentNode && nodes.get(node.parentNode).parentNode) {
		switch (mapStartingPoint) {
			case gd_goal:
				if (
					content_typeArray.find(
						(content_type) => content_type.id === node.selfNodeId
					)
				) {
					let parent = nodes.get(nodes.get(nodeId).parentNode).selfNodeId;
					let grandParent = nodes.get(nodes.get(nodeId).parentNode).parentNode;
					filteredArticles = articlesArray.filter(
						(article) =>
							article.gd_goal === grandParent &&
							article.section === parent &&
							article.content_type === node.selfNodeId
					);
				}
				break;
			case outcome:
				if (sectionArray.find((section) => section.id === node.selfNodeId)) {
					let parent = nodes.get(nodes.get(nodeId).parentNode).selfNodeId;
					let grandParent = nodes.get(nodes.get(nodeId).parentNode).parentNode;
					filteredArticles = articlesArray.filter(
						(article) =>
							article.outcome === grandParent &&
							article.field === parent &&
							article.section === node.selfNodeId
					);
				}
				break;
			case field:
				if (
					content_typeArray.find(
						(content_type) => content_type.id === node.selfNodeId
					)
				) {
					let parent = nodes.get(nodes.get(nodeId).parentNode).selfNodeId;
					let grandParent = nodes.get(nodes.get(nodeId).parentNode).parentNode;
					filteredArticles = articlesArray.filter(
						(article) =>
							article.field === grandParent &&
							article.section === parent &&
							article.content_type === node.selfNodeId
					);
				}
				break;
			case section:
				if (outcomeArray.find((outcome) => outcome.id === node.selfNodeId)) {
					let parent = nodes.get(nodes.get(nodeId).parentNode).selfNodeId;
					let grandParent = nodes.get(nodes.get(nodeId).parentNode).parentNode;
					filteredArticles = articlesArray.filter(
						(article) =>
							article.section === grandParent &&
							article.field === parent &&
							article.outcome === node.selfNodeId
					);
				}
				break;

			case content_type:
				if (sectionArray.find((section) => section.id === node.selfNodeId)) {
					let parent = nodes.get(nodes.get(nodeId).parentNode).selfNodeId;
					let grandParent = nodes.get(nodes.get(nodeId).parentNode).parentNode;
					filteredArticles = articlesArray.filter(
						(article) =>
							article.content_type === grandParent &&
							article.field === parent &&
							article.section === node.selfNodeId
					);
				}
				break;
			default:
				break;
		}
	}

	return filteredArticles;
}
function updateContextArea(nodeId) {
	let filteredArticles = filterArticles(nodeId);

	const contextArea = document.getElementById("context-area");
	const contextHead = document.getElementById("context-head");

	contextArea.innerHTML = "";
	contextHead.innerHTML = "";
	// for every article, create a list entry in the context area
	filteredArticles.forEach((article) => {
		let div = document.createElement("div");
		div.classList.add("context-element");
		contextArea.appendChild(div);
		div.innerHTML += article.title;
	});

	let div2 = document.createElement("div");
	div2.classList.add("context-head-element");
	contextHead.appendChild(div2);
	div2.innerHTML = nodes.get(nodeId).path;
}

function initMap(nodesArray, edgesArray) {
	nodes = new vis.DataSet(nodesArray);
	edges = new vis.DataSet(edgesArray);

	// init edges
	createMainEdges(nodesArray);
	// create a network at div
	const container = document.querySelector(".network");

	const data = {
		nodes: nodes,
		edges: edges,
	};

	const options = {
		layout: { randomSeed: 2 },
		physics: {
			barnesHut: { gravitationalConstant: -20000 },
			stabilization: {
				iterations: 150,
			},
		},

		nodes: {
			chosen: {
				node: (values) => {
					values.color = selectColor;
				},
				label: false,
			},
			font: {
				//size: 12,
				color: "#000000",
			},
			borderWidth: 2,
			scaling: {
				min: 50,
				max: 80,

				label: {
					min: 16,
					max: 25,
					enabled: true,
				},
			},
			shape: "circle",
			widthConstraint: 100,
		},
		edges: {
			width: 2,
			length: edgeLength,
			color: {
				color: primaryColor,
			},
			chosen: {
				label: false,
				edge: (values, id, selected, hovering) => {
					values.color = selectColor;
					values.width = edgeWidthOnSelect;
				},
			},
		},
		interaction: {
			dragNodes: false, // do not allow dragging nodes
			//zoomView: false, // do not allow zooming
			//dragView: false  // do not allow dragging
		},
		groups: {
			source1: {
				color: {
					background: primaryColor,
					border: "navy",
				},
				font: {
					//size: 28,
					color: "#FFFFFF",
				},
				shadow: {
					enabled: true,
					color: "rgba(0,0,0,0.5)",
					x: 6,
					y: 6,
				},
				value: 10,
				interaction: {
					//dragNodes: false, // do not allow dragging node
					//
				},
				chosen: false,
			},
			source2: {
				color: {
					background: "#FFFFFF",
					border: "rgba(50,77,137,1)",
				},
				font: {
					//size: 12,
					color: "rgba(50,77,137,1)",
				},
				shadow: {
					enabled: true,
					color: "rgba(0,0,0,0.5)",
					x: 6,
					y: 6,
				},
				value: 5,
			},
		},
	};

	// create network
	if (!network) {
		network = new vis.Network(container, data, options);
	} else {
		network.setData(data);
	}
}

function createTestArticles() {
	const numberOfArticles = 477;
	for (
		let index = articlesArray.length + 1;
		index < numberOfArticles + 1;
		index++
	) {
		gd_goal_index = Math.floor(Math.random() * 5);
		outcome_index = Math.floor(Math.random() * 3);
		field_index = Math.floor(Math.random() * 3);
		section_index = Math.floor(Math.random() * 7);
		content_type_index = Math.floor(Math.random() * 6);

		let article = {
			id: index,
			title: "Title " + index,
			content: "Lorem ipsum dolor...",
			gd_goal: gd_goalArray[gd_goal_index].id,
			outcome: outcomeArray[outcome_index].id,
			field: fieldArray[field_index].id,
			section: sectionArray[section_index].id,
			content_type: content_typeArray[content_type_index].id,
		};
		articlesArray.push(article);
	}
}

function showNumberOfArticlesOnSubnode(nodeId) {
	let subnodes = network.getConnectedNodes(nodeId);

	subnodes.forEach((subnodeId) => {
		if (!subnodeId) return;
		if (subnodeId === "mainNode:middle") return;
		// fix doubled numbers on parentNode
		if (!nodes.get(subnodeId).parentNode) {
			return;
		}
		let numberOfArticles = filterArticles(subnodeId).length;
		nodes.update({
			id: subnodeId,
			label: nodes.get(subnodeId).label + "\n(" + numberOfArticles + ")",
		});
	});
}
