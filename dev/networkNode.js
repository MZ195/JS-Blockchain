const uuid = require('uuid')
const morgan = require('morgan')
const express = require('express')
const rp = require('request-promise')
const bodyParser = require('body-parser')

// getting the port from the command
const port = process.argv[2]
const Blockchain = require('./blockchain')
const requestPromise = require('request-promise')

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
    const newTransaction = req.body
    let blockIndex = bitcoin.addTransactionToPendingTransactions(newTransaction)

    res.json({
        note: `New transaction will be added to block #${blockIndex}`
    })
})

// creates new transaction AND will broadcast that transaction to all nodes
app.post('/transaction/broadcast', function(req, res) {
    let amount = req.body.amount
    let sender = req.body.sender
    let recipient = req.body.recipient

    const newTransaction = bitcoin.createNewTransaction(amount, sender, recipient)
    bitcoin.addTransactionToPendingTransactions(newTransaction)

    const requestPromises = []
    bitcoin.networkNodes.forEach(networkNodeURL => {
        const requestOptions = {
            uri: networkNodeURL + '/transaction',
            method: 'POST',
            body: newTransaction,
            json: true
        } 

        requestPromises.push(rp(requestOptions))
    })

    Promise.all(requestPromises)
    .then(data => {
        res.json({
            note: 'Transaction created and broadcast successfully.'
        })
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

    // broadcast the new block to all nodes on the network
    const requestPromises = []
    bitcoin.networkNodes.forEach(networkNodeURL => {
        const requestOptions = {
            uri: networkNodeURL + '/receive-new-block',
            method: 'POST',
            body: {
                newBlock: newBlock
            },
            json: true
        }
        requestPromises.push(rp(requestOptions))
    })

    Promise.all(requestPromises)
    .then(data => {
        // reward for the mining node
        const requestOptions = {
            uri: bitcoin.currentNodeURL + '/transaction/broadcast',
            method: 'POST',
            body: {
                amount: 12.5,
                sender: "0000000000000000000000000000000000000000000000000000000000000000",
                recipient: nodeAddress
            },
            json: true
        }

        return rp(requestOptions)
    })

    .then(data => {
        res.json({
            note: 'New block mined and broadcast successfully',
            block: newBlock
        })
    })
})

app.post('/receive-new-block', function(req, res) {
    
    let lastBlock = bitcoin.getLastBlock()
    const newBlock = req.body.newBlock

    // validating the new block
    const correctHash = lastBlock.hash === newBlock.previousBlockHash
    const correctIndex = (lastBlock['index'] + 1) === newBlock['index']

    // accepting the new block and clearing the pending transactions
    if(correctHash && correctIndex){
        bitcoin.chain.push(newBlock)
        bitcoin.pendingTransactions = []
        
        res.json({
            note: "New block received and accepted.",
            newBlock: newBlock
        })
    } else {
        res.json({
            note: "New block rejected!",
            newBlock: newBlock
        })
    }
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
                body: {allNetworkNodes: [...bitcoin.networkNodes, bitcoin.currentNodeURL]},
                json: true
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
app.post('/register-node', function(req, res) {
    const newNodeURL = req.body.newNodeURL

    // check if the node already exists and the new node's url is not of this node
    if(bitcoin.networkNodes.indexOf(newNodeURL) == -1 && bitcoin.currentNodeURL !== newNodeURL)
        bitcoin.networkNodes.push(newNodeURL)

    res.json({
        note: 'New Node registered successfully.'
    })
})

// register multiple nodes at once in the new node
app.post('/register-nodes-bulk', function(req, res) {
    const allNetworkNodes = req.body.allNetworkNodes
    allNetworkNodes.forEach(networkNodeURL => {
        if(bitcoin.networkNodes.indexOf(networkNodeURL) == -1 && bitcoin.currentNodeURL !== networkNodeURL)
            bitcoin.networkNodes.push(networkNodeURL)
    })

    res.json({
        note: "Bulk registration successful."
    })
})

app.get('/consensus', function(req, res) {
    
    const requestPromises = []
    bitcoin.networkNodes.forEach(networkNodeURK => {
        const requestOptions = {
            uri: networkNodeURK + '/blockchain',
            method: 'GET',
            json: true
        }

        requestPromises.push(rp(requestOptions))
    })

    Promise.all(requestPromises)
    .then(blockchains => {
        const currentBlockchainLength = bitcoin.chain.length
        let maxChainLength = currentBlockchainLength
        let newLongestChain = null
        let newPendingTransactions = null

        blockchains.forEach(blockchain => {
            // we want to see if there is a blockchain longer than the blockchain hosted on the current node
            if(blockchain.chain.length > maxChainLength){
                maxChainLength = blockchain.chain.length
                newLongestChain = blockchain.chain
                newPendingTransactions = blockchain.pendingTransactions
            }
        })

        if(newLongestChain === null || (!bitcoin.chainIsValid(newLongestChain))){
            res.json({
                note: "Current chain has not been replaced.",
                chain: bitcoin.chain
            })
        } else if(newLongestChain !== null && bitcoin.chainIsValid(newLongestChain)){
            bitcoin.chain = newLongestChain
            bitcoin.pendingTransactions = newPendingTransactions

            res.json({
                note: "Current chain has been repleaces.",
                chain: bitcoin.chain
            })
        }
    })
})

// ---------------------------------------------------------------------------------------
// block explorer endpoints

// receive a hash block and return the details about that block
app.get('/block/:blockHash', function(req, res) {
    const blockHash = req.params.blockHash
    let result = bitcoin.getBlock(blockHash)

    if(result !== null){
        res.json({
            note: "Block fetched successfully.",
            block: result
        })
    }else {
        res.json({
            note: "Block does not exists."
        })
    }
})

// receive a transaction ID and return the details about that transaction
app.get('/transaction/:transactionId', function(req, res) {
    const transactionId = req.params.transactionId
    result = bitcoin.getTransaction(transactionId)

    if(result !== null){
        res.json({
            note:"Transaction fetched successfully.",
            block: result.block,
            transaction: result.transaction
        })
    } else {
        res.json({
            note: "Transaction ID does not exists!"
        })
    }
})

// receive a specific address and returns all transactions done by that user + the current balance of that address
app.get('/address/:address', function(req, res) {
    const address = req.params.address

    result = bitcoin.getAddressData(address)

    res.json({
        note: "Address Data fetched successfully.",
        addressTransactions: result.addressTransactions,
        addressBalance: result.addressBalance
    })
})

app.get('/block-explorer', function(req, res) {
    res.sendFile('./block-explorer/index.html', {root: __dirname})
})

app.listen(port, function () {
    console.log(`Listening on port ${port}...`)
})