// --- Bindings

const submitButton = document.getElementById("submit");
submitButton.addEventListener('click', () => {
    // radio button selection

    if (document.getElementById("categories").checked === true) {
        console.log('categories checked')
        mapStartingPoint = categories
        createNodesArray();
    }
    if (document.getElementById("contentType").checked === true) {
        console.log('contentType checked')
        mapStartingPoint = contentType
        console.log('mapStartingPoint', mapStartingPoint)
        createNodesArray();
    }
    if (document.getElementById("language").checked === true) {
        console.log('language checked')
        mapStartingPoint = language
        createNodesArray()
    }
})

const focusOnPublicTransportButton = document.getElementById("focusOnPublicTransport");
focusOnPublicTransportButton.addEventListener('click', () => {
    network.focus(publicTransport, {animation: true})
})

// --- end bindings