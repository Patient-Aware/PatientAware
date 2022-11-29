export async function startTest(antigenSelections) {

    //TODO: update this to make request to backend
    localStorage.setItem("test", JSON.stringify(antigenSelections))
}

export async function getTest() {
    const test = JSON.parse(localStorage.getItem("test"))
    return test
}