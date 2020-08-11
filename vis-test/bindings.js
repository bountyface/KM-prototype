// --- Bindings

const submitButton = document.getElementById("submit");
submitButton.addEventListener("click", () => {
	// radio button selection

	if (document.getElementById("gd_goal_radio").checked === true) {
		console.log("gd_goal checked");
		mapStartingPoint = gd_goal;
		createNodesArray();
	}
	if (document.getElementById("contentType").checked === true) {
		console.log("contentType checked");
		mapStartingPoint = contentType;
		console.log("mapStartingPoint", mapStartingPoint);
		createNodesArray();
	}
	if (document.getElementById("region").checked === true) {
		console.log("region checked");
		mapStartingPoint = region;
		createNodesArray();
	}
});
/*
const focusOnPublicTransportButton = document.getElementById(
	"focusOnPublicTransport"
);
focusOnPublicTransportButton.addEventListener("click", () => {
	//network.focus(publicTransport, {animation: true})
	collapseNode(publicTransport);
});
*/
// --- end bindings
