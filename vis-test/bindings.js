// --- Bindings

const submitButton = document.getElementById("submit");
submitButton.addEventListener("click", () => {
	// radio button selection

	if (document.getElementById("gd_goal_radio").checked === true) {
		console.log("gd_goal checked");
		mapStartingPoint = gd_goal;
		createKnowledgeMap();
	}
	if (document.getElementById("outcome_radio").checked === true) {
		console.log("outcome checked");
		mapStartingPoint = outcome;
		createKnowledgeMap();
	}
	if (document.getElementById("field_radio").checked === true) {
		console.log("field checked");
		mapStartingPoint = field;
		createKnowledgeMap();
	}
	if (document.getElementById("section_radio").checked === true) {
		console.log("section checked");
		mapStartingPoint = section;
		createKnowledgeMap();
	}
	if (document.getElementById("content_type_radio").checked === true) {
		console.log("content_type checked");
		mapStartingPoint = content_type;
		createKnowledgeMap();
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
