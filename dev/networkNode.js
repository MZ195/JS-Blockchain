const uuid = require('uuid')
const morgan = require('morgan')
const express = require('express')
const rp = require('request-promise')
const bodyParser = require('body-parser')

// getting the port from the command
const port = process.argv[2]
const Blockchain = require('./blockchain')

const app = express()
const bitcoin = new Blockchain()

// unique node address to each node in the network
const nodeAddress = uuid.v1().split('-').join('')

app.use(bodyParser.json())
app.use(morgan('combined'))
app.use(bodyParser.urlencoded({extended: false}))


// retuns the whole blockchain
app.get('/blockchain', function (req, res) {
    res.send(bitcoin)
})

// creates a new transaction and adds it to the pending transactions
app.post('/transaction', function (req, res) {
    let amount = req.body.amount
    let sender = req.body.sender
    let recipient = req.body.recipient

    const blockIndex = bitcoin.createNewTransaction(amount, sender, recipient)
    res.json({
        note: `Transaction will be added to block ${blockIndex}.`
    })
})

// create a new block from the pending transactions
app.get('/mine', function (req, res) {
    const lastBlock = bitcoin.getLastBlock()
    const previousBlockHash = lastBlock['hash']
    const currentBlockData = {
        transactions: bitcoin.pendingTransactions,
        index: lastBlock['index'] + 1
    }

    const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData)
    const hash = bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce)

    const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, hash)

    // reward for the mining node
    bitcoin.createNewTransaction(12.5, "00", nodeAddress)
    
    res.json({
        note: `New block mined successfully`,
        block: newBlock
    })
})

// register the new node and broadcast it's URL to other nodes in the network
app.post('/register-and-broadcast-node', function(req, res) {
    const newNodeURL = req.body.newNodeURL
    
    if (bitcoin.networkNodes.indexOf(newNodeURL) == -1) 
        bitcoin.networkNodes.push(newNodeURL)

    const regNodesPromises = []

    bitcoin.networkNodes.forEach(networkNodeURL => {
        // we need to hit /register-node endpoint for all other nodes
        const requestOptions = {
            uri: networkNodeURL + '/register-node',
            method: 'POST',
            body: {newNodeURL: newNodeURL},
            json: true
        }
        // since we don't know how long each request might take
        // it's better to send them all at once and collect the responses later.
        regNodesPromises.push(rp(requestOptions))
    })

    // promise all will excute all the requests in regNodesPromises
    Promise.all(regNodesPromises)
        .then(data => {
            // this chunk of code will be excuted after all requests are completed successfully
            // we will be bulk registering all network nodes to the new node
            const bulkRegisterOptions = {
                uri: newNodeURL + '/register-nodes-bulk',
                method: 'POST',
                body: {allNetworkNodes: [...bitcoin.networkNodes, bitcoin.currentNodeURL]}
            }
            rp(bulkRegisterOptions)
        })

        .then(data => {
            // we will send back a note to the new node
            res.json({
                note: 'New Node registered with network successfully'
            })
        })
    })

// register the node on the network
app.post('/resigter-node', function(req, res) {
    const newNodeURL = req.body.newNodeURL

    // check if the node already exists and the new node's url is not of this node
    if(bitcoin.networkNodes.indexOf(newNodeURL) == -1 && bitcoin.currentNodeURL !== newNodeURL)
        bitcoint.networkNodes.push(newNodeURL)

    res.json({
        note: 'New Node registered successfully.'
    })
})

// register multiple nodes at once in the new node
app.post('/register-nodes-bulk', function(req, res) {
    const allNetworkNodes = req.body.allNetworkNodes
    allNetworkNodes.forEach(networkNodeURL => {
        if(bitcoin.networkNodes.indexOf(networkNodeURL) == -1 && bitcoin.currentNodeURL !== newNodeURL)
            bitcoin.networkNodes.push(networkNodeURL)
    })
})

app.listen(port, function () {
    console.log(`Listening on port ${port}...`)
})