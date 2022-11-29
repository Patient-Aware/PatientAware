export async function startTest(antigenSelections) {

    //TODO: update this to make request to backend
    localStorage.setItem("test", JSON.stringify(antigenSelections))
}

export async function getTest() {
    const test = JSON.parse(localStorage.getItem("test"))
    return test
}

export async function getResults() {

    const test = await getTest()

    const selectedAntigens = Object.values(test)
        .filter(portSelection => portSelection !== "None")

    // come up with some random values until backend is integrated
    const antigenLevels = {
        'CEA': Math.floor(Math.random() * 10 + 5),
        'CA19-9': Math.floor(Math.random() * 10),
        'KRAS': Number.parseFloat(Math.random() * 3).toFixed(2),
        'BRAF V600E': Number.parseFloat(Math.random() * 0.5).toFixed(2)
    }

    return selectedAntigens.map(antigen => { return { antigen: antigen, detectedLevel: antigenLevels[antigen] } })
}