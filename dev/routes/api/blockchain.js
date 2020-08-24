const express = require("express")
const router = express.Router()
var bitcoin = require("../../Network.js")

// retuns the whole blockchain
router.get('/', function (req, res) {
    res.send(bitcoin)
})

// create a new block from the pending transactions
router.get('/mine', function (req, res) {
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

router.get('/consensus', function(req, res) {
    
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

module.exports = router