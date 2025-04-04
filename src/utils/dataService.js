const fs = require("fs")
const path = require("path")

const DATA_FILE = path.join(__dirname, "../../data/data.json")
let cache = null;

function loadData() {
    if (!cache) {
        const rawData = fs.readFileSync(DATA_FILE)
        cache = JSON.parse(rawData)
    }
    return cache
}

module.exports = { loadData }
