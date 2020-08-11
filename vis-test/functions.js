// init nodes
function createNodesArray() {
	// center node

	// creates nodesArray according to selected mapStartingPoint and delivers
	// it to initMap()
	switch (mapStartingPoint) {
		case categories:
			console.log("case categories");
			// todo initMap()
			const categoriesNodesArray = [];
			categoriesNodesArray.push({
				id: "mainNode:middle",
				label: "Categories",
				group: "source1",
			});
			// every other node around the center node
			tagsArray.forEach((tag) => {
				categoriesNodesArray.push({
					id: tag.id,
					label: tag.label,
					group: "source2",
					expanded: false,
				});
			});
			initMap(categoriesNodesArray, edgesArray);
			break;
		case contentType:
			console.log("case contentType");
			// todo initMap()
			const contentTypeNodesArray = [];
			contentTypeNodesArray.push({
				id: "mainNode:middle",
				label: "Content Type",
				group: "source1",
			});
			typeOfContentArray.forEach((typeOfContent) => {
				contentTypeNodesArray.push({
					id: typeOfContent.id,
					label: typeOfContent.label,
					group: "source3",
				});
			});
			initMap(contentTypeNodesArray, edgesArray);
			break;
		case region:
			console.log("case region");
			const regionNodesArray = [];
			regionNodesArray.push({
				id: "mainNode:middle",
				label: "Region",
				group: "source1",
			});
			regionsArray.forEach((region) => {
				regionNodesArray.push({
					id: region.id,
					label: region.label,
					group: "source5",
				});
			});
			initMap(regionNodesArray, edgesArray);
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
		length: 400,
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
	console.log("getNewPosition", network.getPosition(clickedNodeId));

	// set origin position into array to collapse it later
	const oldNodePosition = network.getPosition(clickedNodeId);

	nodes.update({
		id: clickedNodeId,
		oldX: oldNodePosition.x,
		oldY: oldNodePosition.y,
		expanded: true,
	});

	// make edge to parent of selected node longer
	growParentEdgeOfNode(clickedNodeId);

	// position of the clicked node
	const newNodePosition = network.getPosition(clickedNodeId);

	let clickedOnTypeOfContent = false;
	let clickedOnTag = false;
	let clickedOnRegion = false;
	// temporary Array
	let subnodeArray = [];
	// assign group of subnode to right value according to node clicked
	let groupForSubnode = "";

	// find parent of node
	const edgeId = network.getConnectedEdges(clickedNodeId);
	// getConnectedNodes only returns an array of the connected nodes on the first call
	const parentNode = network.getConnectedNodes(edgeId)[0];

	switch (mapStartingPoint) {
		case categories:
			// check if clicked node is part of tagsArray or typeOfContentArrray
			// clicked on typeOfContent?

			if (
				typeOfContentArray.find(
					(typeOfContent) => typeOfContent.id === node.selfNodeId
				)
			) {
				articlesArray.forEach((article) => {
					// push every article, that has the type of the clicked node && where the right tag occurs
					article.type === node.selfNodeId &&
					article.tags.find((tag) => tag === parentNode)
						? subnodeArray.push(article)
						: null;
				});

				clickedOnTypeOfContent = true;
				console.log("clickedOnTypeOfContent", clickedOnTypeOfContent);
			}
			// clicked on tag?
			if (tagsArray.find((tag) => tag.id === clickedNodeId)) {
				// cycle through typeOfContents and save every element to the subnode
				// todo: if no articles with according type of Content: type of content node does not show up in the map
				typeOfContentArray.forEach((typeOfContent) => {
					subnodeArray.push(typeOfContent);
				});
				clickedOnTag = true;
				console.log("clickedOnTag", clickedOnTag);
			}

			// iterate through subnodeArray
			subnodeArray.forEach((subnode) => {
				// return, if node is already on the network
				//if (network.findNode(subnode.id).length) return;

				// make a node for each article in subnodeArray
				nodes.add({
					id: subnode.id + "-" + clickedNodeId,
					label:
						mapStartingPoint === categories && clickedOnTag
							? subnode.label
							: subnode.title,
					group: clickedOnTag ? "source2" : "source2",
					x: newNodePosition.x,
					y: newNodePosition.y,
					selfNodeId: subnode.id,
					parentNode: clickedNodeId,
				}),
					// make an edge from the clicked node to its subnodes
					edges.add({
						from: clickedNodeId,
						to: subnode.id + "-" + clickedNodeId,
					});
			});
			break;

		case contentType:
			console.log("node", node);
			// clicked on type of content?
			if (
				typeOfContentArray.find((typeOfContent) => typeOfContent.id === node.id)
			) {
				tagsArray.forEach((tag) => {
					// push every tag
					subnodeArray.push(tag);
				});

				clickedOnTypeOfContent = true;
				console.log("clickedOnTypeOfContent", clickedOnTypeOfContent);
			}

			// clicked on tag?
			if (tagsArray.find((tag) => tag.id === node.selfNodeId)) {
				// cycle through typeOfContents and save every element to the subnode
				// todo: if no articles with according type of Content: type of content node does not show up in the map
				articlesArray.forEach((article) => {
					// push every article, that has the type of the clicked node && where the right tag occurs
					article.type === node.parentNode &&
					article.tags.find((tag) => tag === node.selfNodeId)
						? subnodeArray.push(article)
						: null;
				});
				clickedOnTag = true;
				console.log("clickedOnTag", clickedOnTag);
			}

			// iterate through subnodeArray
			subnodeArray.forEach((subnode) => {
				// return, if node is already on the network
				//if (network.findNode(subnode.id).length) return;

				// make a node for each article in subnodeArray
				nodes.add({
					id: subnode.id + "-" + clickedNodeId,
					label: clickedOnTypeOfContent ? subnode.label : subnode.title,
					group: clickedOnTypeOfContent ? "source2" : "source4",
					x: newNodePosition.x,
					y: newNodePosition.y,
					selfNodeId: subnode.id,
					parentNode: clickedNodeId,
				});
				// make an edge from the clicked node to its subnodes
				edges.add({
					from: clickedNodeId,
					to: subnode.id + "-" + clickedNodeId,
				});
			});
			break;

		case region:
			// clicked on region?
			if (regionsArray.find((region) => region.id === node.id)) {
				tagsArray.forEach((tag) => {
					subnodeArray.push(tag);
				});
				clickedOnRegion = true;
				groupForSubnode = "source2";
			}

			// clicked on tag?
			if (tagsArray.find((tag) => tag.id === node.selfNodeId)) {
				typeOfContentArray.forEach((typeOfContent) => {
					subnodeArray.push(typeOfContent);
				});
				clickedOnTag = true;
				groupForSubnode = "source3";
			}

			// clicked on typeOfContent?
			if (
				typeOfContentArray.find(
					(typeOfContent) => typeOfContent.id === node.selfNodeId
				)
			) {
				const realParentNode = nodes.get(parentNode);
				articlesArray.forEach((article) => {
					// push every article, that has the type of clicked node && where the right tag occurs && where the region matches
					article.type === node.selfNodeId &&
					article.tags.find((tag) => tag === realParentNode.selfNodeId) &&
					article.region === realParentNode.parentNode
						? subnodeArray.push(article)
						: null;
				});
				clickedOnTypeOfContent = true;
				groupForSubnode = "source4";
			}

			// iterate through subnodeArray
			subnodeArray.forEach((subnode) => {
				// return, if node is already on the network
				//if (network.findNode(subnode.id).length) return;

				// make a node for each article in subnodeArray
				nodes.add({
					id: subnode.id + "-" + clickedNodeId,
					label:
						clickedOnTag || clickedOnRegion ? subnode.label : subnode.title,
					group: groupForSubnode,
					x: newNodePosition.x,
					y: newNodePosition.y,
					selfNodeId: subnode.id,
					parentNode: clickedNodeId,
				});
				// make an edge from the clicked node to its subnodes
				edges.add({
					from: clickedNodeId,
					to: subnode.id + "-" + clickedNodeId,
				});
			});
			break;
	}
}

function collapseNode(nodeId) {
	if (nodeId === "mainNode:middle") return;
	//console.log(nodes.get());
	const edgeId = network.getConnectedEdges(nodeId);

	// getConnectedNodes only returns an array of the connected nodes on the first call
	const parentNode = network.getConnectedNodes(edgeId)[0];
	console.log("parentNode - sometimes undefined?!", parentNode);

	edges.update({
		id: edgeId[0],
		length: 250,
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

	// todo: destroy all the other edges and nodes and their children, except mainEdge
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
			chosen: false,

			font: {
				//size: 12,
				color: "#000000",
			},
			borderWidth: 2,
			scaling: {
				min: 50,
				max: 80,

				label: {
					min: 12,
					max: 17,
					enabled: true,
				},
			},
			shape: "circle",
			physics: true,
			widthConstraint: 90,
		},
		edges: {
			width: 2,
			length: 250,
			color: {
				color: edgeColor,
			},
			chosen: {
				label: false,
				edge: (values, id, selected, hovering) => {
					values.color = selectEdgeColor;
					values.width = 4;
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
					background: "rgba(50,77,137,1)",
					border: "navy",
				},
				font: {
					size: 18,
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
			source3: {
				font: {
					color: "#000000",
				},
				color: {
					background: "#ffbf00",
					border: "navy",
				},
				shadow: {
					enabled: true,
					color: "rgba(0,0,0,0.5)",
					x: 6,
					y: 6,
				},
				// if changed, sizing error onclick occurs
				value: 2,
			},
			source4: {
				font: {
					color: "#000000",
				},
				color: {
					background: "#ef3737",
					border: "navy",
				},
				shadow: {
					enabled: true,
					color: "rgba(0,0,0,0.5)",
					x: 6,
					y: 6,
				},
				// if changed, sizing error onclick occurs
				value: 1,
			},
			source5: {
				font: {
					color: "#000000",
				},
				color: {
					background: "#fff755",
					border: "navy",
				},
				shadow: {
					enabled: true,
					color: "rgba(0,0,0,0.5)",
					x: 6,
					y: 6,
				},
				// if changed, sizing error onclick occurs
				value: 1,
			},
		},
	};

	// create network
	if (!network) {
		network = new vis.Network(container, data, options);
	}
	network.setData(data);
}
