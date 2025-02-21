const express = require("express")
const port = process.env.PORT || 3000
const app = express()

app.use(express.static(__dirname + "/dist/"))

app.get(/.*/, (req, res) => {
    res.sendFile(__dirname + "/dist/index.html")
})


// export 'app'
module.exports = app