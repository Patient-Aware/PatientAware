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

export async function addPastTest(test) {
    //DEMO CODE
    //TODO: update this to request past tests from backend
    let past_tests = localStorage.getItem("past_tests") ? JSON.parse(localStorage.getItem("past_tests")) : []
    console.log('test added')
    past_tests.push(test)
    localStorage.setItem("past_tests", JSON.stringify(past_tests))

}

export async function getPastTests() {
    if (!localStorage.getItem("past_tests")) {
        return []
    }

    return JSON.parse(localStorage.getItem("past_tests"))
}