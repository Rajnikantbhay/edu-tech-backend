const router = require("express").Router();

router.get("/api/data", async (req, res) => {
    try {
        const fetchedItems = global.videoData;
        res.json({success: true, data: fetchedItems});
    } catch (error) {
        console.log("error occured due to fething items "+error.message)
    }
})

module.exports = router;