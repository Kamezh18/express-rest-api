const express = require("express")
const { loadData } = require("../utils/dataService")
const { authenticate } = require("../middleware/authMiddleware")
const router = express.Router()


router.get("/", authenticate, (req, res) => {
    res.json(loadData())
});

// Searching
router.get("/search", authenticate, (req, res) => {
    const { query } = req.query
    const data = loadData()
    if (!query) {
        return res.status(400).json({mesage: "Please provide the appropirate Query"})
    }
    // const results = data.filter(item => 
    //   item.API.toLowerCase().includes(query.toLowerCase())
    // )
    const results = data.filter(item =>
        Object.values(item).some(value =>
            typeof value === "string" && value.toLowerCase().includes(query.toLowerCase())
        )
    );
    res.json(results);
});

// Sorting
router.get("/sort", authenticate, (req, res) => {
    const { field, order = "desc" } = req.query;
    const data = loadData();
    if (!field) {
        return res.status(400).json({ message: "Please provide the appropirate Field parameter" })
    }
    const sorted = [...data].sort((a, b) => {

        let valA = a[field]
        let valB = b[field]

        if (valA === undefined || valB === undefined ) {
            return 0;
        }

        if (typeof valA === "string" || typeof valB ==="string") {
            valA = valA.toLowerCase()
            valB = valB.toLowerCase()
            return order === "desc" ? valB.localeCompare(valA) : valA.localeCompare(valB)
        }
        if (typeof valA ==="number" || typeof valB === "number") {
            return order ==="desc" ? valB - valA : valA - valB
        }
        return 0;
    });
    res.json(sorted);
});

// Filtering
router.get("/filter", authenticate, (req, res) => {
    const filters = req.query
    const data = loadData()

    console.log("Filters received:", filters)

    const filteredData = data.filter(item => {
        return Object.keys(filters).every(queryKey => {
            const actualKey = Object.keys(item).find(
                jsonKey => jsonKey.toLowerCase() === queryKey.toLowerCase()
            );
            if (!actualKey) return false
            let itemValue = item[actualKey].toString().toLowerCase()
            let filterValue = filters[queryKey].toLowerCase()

            console.log(`Checking key: ${actualKey}, Data: ${itemValue}, Filter: ${filterValue}`)

            return itemValue === filterValue;
        });
    });
    console.log("Filtered Data:", filteredData);
    res.json(filteredData);
});

// Pagination
router.get("/paginate", authenticate, (req, res) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const data = loadData();
    const start = (page - 1) * limit
    const end = start + limit
    const paginatedData = data.slice(start, end)
    
    if (paginatedData.length === 0) {
        return res.status(404).json({ message: "No data found for this page." })
    }
    res.json(paginatedData);
    // res.json({
    //     page,
    //     limit,
    //     totalRecords: data.length,
    //     totalPages: Math.ceil(data.length / limit),
    //     data: paginatedData
    // });
});

module.exports = router;
