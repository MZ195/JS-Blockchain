const uuid = require('uuid')
const morgan = require('morgan')
const express = require('express')
const bodyParser = require('body-parser')
const Blockchain = require('./modules/blockchain')

const bitcoin = new Blockchain()

// getting the port from the command
const port = process.argv[2]

const app = express()

const blockchain = require("./routes/api/blockchain")
const register = require("./routes/api/register")
const transaction = require("./routes/api/transaction")
const blockExplorer = require("./routes/api/blockExplorer")

app.use("/api/blockchain", blockchain)
app.use("/api/transaction", transaction)
app.use("/api/register", register)
app.use("/api/blockExplorer", blockExplorer)

// unique node address to each node in the network
const nodeAddress = uuid.v1().split('-').join('')

app.use(bodyParser.json())
app.use(morgan('combined'))
app.use(bodyParser.urlencoded({extended: false}))

app.listen(port, function () {
    console.log(`Listening on port ${port}...`)
})

module.exports.bitcoin = bitcoin