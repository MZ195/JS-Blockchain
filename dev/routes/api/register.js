const express = require("express")
const router = express.Router()
const bitcoin = require("../../Network")

router.post('/receive-new-block', function(req, res) {
    
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
router.post('/register-and-broadcast-node', function(req, res) {
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
router.post('/register-node', function(req, res) {
    const newNodeURL = req.body.newNodeURL

    // check if the node already exists and the new node's url is not of this node
    if(bitcoin.networkNodes.indexOf(newNodeURL) == -1 && bitcoin.currentNodeURL !== newNodeURL)
        bitcoin.networkNodes.push(newNodeURL)

    res.json({
        note: 'New Node registered successfully.'
    })
})

// register multiple nodes at once in the new node
router.post('/register-nodes-bulk', function(req, res) {
    const allNetworkNodes = req.body.allNetworkNodes
    allNetworkNodes.forEach(networkNodeURL => {
        if(bitcoin.networkNodes.indexOf(networkNodeURL) == -1 && bitcoin.currentNodeURL !== networkNodeURL)
            bitcoin.networkNodes.push(networkNodeURL)
    })

    res.json({
        note: "Bulk registration successful."
    })
})

module.exports = router