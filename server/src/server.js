const express = require('express')
const cors = require('cors')
const app = express()

const PORT = 5000

app.use(function(req, res, next) {
     res.header("Access-Control-Allow-Origin", "*");
     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
     next();
});

app.get('/', (req, res) => {
    res.send('Hello from the Node.js backend!')
})

app.listen(5000, () => {
    console.log(`Server is listening on http://localhost:${PORT}`)
})

