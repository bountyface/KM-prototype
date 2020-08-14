// init nodes
function createNodesArray() {
	// center node

	// creates nodesArray according to selected mapStartingPoint and delivers
	// it to initMap()
	switch (mapStartingPoint) {
		case gd_goal:
			console.log("case gd_goal");
			// todo initMap()
			const gd_goalNodesArray = [];
			gd_goalNodesArray.push({
				id: "mainNode:middle",
				label: "Gender & Diversity Goal",
				group: "source1",
			});
			// every other node around the center node
			gd_goalArray.forEach((gd_goal) => {
				gd_goalNodesArray.push({
					id: gd_goal.id,
					label: gd_goal.label,
					group: "source2",
					expanded: false,
					color: "#FFFFFF",
				});
			});
			console.log("gd_goalNodesArray", gd_goalNodesArray);
			initMap(gd_goalNodesArray, edgesArray);
			break;
		case outcome:
			console.log("case field");
			const outcomeNodesArray = [];
			outcomeNodesArray.push({
				id: "mainNode:middle",
				label: "Outcome",
				group: "source1",
			});
			outcomeArray.forEach((outcome) => {
				outcomeNodesArray.push({
					id: outcome.id,
					label: outcome.label,
					group: "source2",
				});
			});
			initMap(outcomeNodesArray, edgesArray);
			break;
		case field:
			console.log("case field");
			const fieldNodesArray = [];
			fieldNodesArray.push({
				id: "mainNode:middle",
				label: "Field",
				group: "source1",
			});
			fieldArray.forEach((field) => {
				fieldNodesArray.push({
					id: field.id,
					label: field.label,
					group: "source2",
				});
			});
			initMap(fieldNodesArray, edgesArray);
			break;

		case section:
			console.log("case section");
			const sectionNodesArray = [];
			sectionNodesArray.push({
				id: "mainNode:middle",
				label: "Section",
				group: "source1",
			});
			sectionArray.forEach((section) => {
				sectionNodesArray.push({
					id: section.id,
					label: section.label,
					group: "source2",
				});
			});
			initMap(sectionNodesArray, edgesArray);
			break;

		case content_type:
			console.log("case content_type");
			const content_typeNodesArray = [];
			content_typeNodesArray.push({
				id: "mainNode:middle",
				label: "Content Type",
				group: "source1",
			});
			content_typeArray.forEach((content_type) => {
				content_typeNodesArray.push({
					id: content_type.id,
					label: content_type.label,
					group: "source2",
				});
			});
			initMap(content_typeNodesArray, edgesArray);
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
	// set origin position into array to collapse it later
	const nodePosition = network.getPosition(clickedNodeId);

	nodes.update({
		id: clickedNodeId,
		expanded: true,
	});

	// make edge to parent of selected node longer
	growParentEdgeOfNode(clickedNodeId);
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
		case gd_goal:
			// clicked on gd_goal element?
			if (gd_goalArray.find((element) => element.id === clickedNodeId)) {
				console.log("hey");

				sectionArray.forEach((section) => {
					subnodeArray.push(section);
				});
				console.log("clickedOn gd_Goal");
			}

			// clicked on section?
			if (sectionArray.find((element) => element.id === node.selfNodeId)) {
				content_typeArray.forEach((content_type) => {
					subnodeArray.push(content_type);
				});
				console.log("clickedOn section");
			}

			// iterate through subnodeArray
			subnodeArray.forEach((subnode) => {
				// return, if node is already on the network

				// make a node for each article in subnodeArray
				nodes.add({
					id: subnode.id + "-" + clickedNodeId,
					label: subnode.label,
					group: "source2",
					selfNodeId: subnode.id,
					parentNode: clickedNodeId,
					x: nodePosition.x,
					y: nodePosition.y,
				}),
					// make an edge from the clicked node to its subnodes
					edges.add({
						from: clickedNodeId,
						to: subnode.id + "-" + clickedNodeId,
					});
			});
			break;

		case outcome:
			console.log("node", node);
			// clicked on outcome?
			if (outcomeArray.find((outcome) => outcome.id === node.id)) {
				fieldArray.forEach((field) => {
					subnodeArray.push(field);
				});
				console.log("clickedOn outcome");
			}
			// clicked on field?
			if (fieldArray.find((field) => field.id === node.selfNodeId)) {
				sectionArray.forEach((section) => {
					subnodeArray.push(section);
				});
				console.log("clickedOn field");
			}

			// iterate through subnodeArray
			subnodeArray.forEach((subnode) => {
				// make a node for each article in subnodeArray
				nodes.add({
					id: subnode.id + "-" + clickedNodeId,
					label: subnode.label,
					group: "source2",
					selfNodeId: subnode.id,
					parentNode: clickedNodeId,
					x: nodePosition.x,
					y: nodePosition.y,
				});
				// make an edge from the clicked node to its subnodes
				edges.add({
					from: clickedNodeId,
					to: subnode.id + "-" + clickedNodeId,
				});
			});
			break;

		case field:
			console.log("node", node);
			// clicked on field?
			if (fieldArray.find((field) => field.id === node.id)) {
				sectionArray.forEach((section) => {
					subnodeArray.push(section);
				});
				console.log("clickedOn field");
			}

			// clicked on section?
			if (sectionArray.find((section) => section.id === node.selfNodeId)) {
				content_typeArray.forEach((content_type) => {
					subnodeArray.push(content_type);
				});
				console.log("clickedOn content_type");
			}

			// iterate through subnodeArray
			subnodeArray.forEach((subnode) => {
				// make a node for each article in subnodeArray
				nodes.add({
					id: subnode.id + "-" + clickedNodeId,
					label: subnode.label,
					group: "source2",
					selfNodeId: subnode.id,
					parentNode: clickedNodeId,
					x: nodePosition.x,
					y: nodePosition.y,
				});
				// make an edge from the clicked node to its subnodes
				edges.add({
					from: clickedNodeId,
					to: subnode.id + "-" + clickedNodeId,
				});
			});
			break;

		case section:
			console.log("node", node);

			// clicked on section?
			if (sectionArray.find((section) => section.id === node.id)) {
				fieldArray.forEach((field) => {
					subnodeArray.push(field);
				});
				console.log("clickedOn section");
			}
			/* ToDo: Dritte Kategorie von Sebastian und Cathleen
			// clicked on section?
			if (sectionArray.find((section) => section.id === node.selfNodeId)) {
				content_typeArray.forEach((content_type) => {
					subnodeArray.push(content_type);
				});
				console.log("clickedOn content_type");
			}
			*/

			// iterate through subnodeArray
			subnodeArray.forEach((subnode) => {
				// make a node for each article in subnodeArray
				nodes.add({
					id: subnode.id + "-" + clickedNodeId,
					label: subnode.label,
					group: "source2",
					selfNodeId: subnode.id,
					parentNode: clickedNodeId,
					x: nodePosition.x,
					y: nodePosition.y,
				});
				// make an edge from the clicked node to its subnodes
				edges.add({
					from: clickedNodeId,
					to: subnode.id + "-" + clickedNodeId,
				});
			});
			break;

		case content_type:
			// clicked on content_type?
			if (
				content_typeArray.find((content_type) => content_type.id === node.id)
			) {
				fieldArray.forEach((field) => {
					subnodeArray.push(field);
				});
				console.log("clickedOn content_type");
			}

			// clicked on field?
			if (fieldArray.find((field) => field.id === node.selfNodeId)) {
				sectionArray.forEach((section) => {
					subnodeArray.push(section);
				});
				console.log("clickedOn field");
			}

			// iterate through subnodeArray
			subnodeArray.forEach((subnode) => {
				// make a node for each article in subnodeArray
				nodes.add({
					id: subnode.id + "-" + clickedNodeId,
					label: subnode.label,
					group: "source2",
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
	//console.log("parentNode - sometimes undefined?!", parentNode);

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
				node: (values, id, selected, hovering) => {
					values.color = selectColor;
					//nodes.get(id).parentNode.color = selectEdgeColor;
				},
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
					background: "rgba(50,77,137,1)",
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
	}
	network.setData(data);
}
