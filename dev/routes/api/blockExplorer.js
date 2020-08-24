const express = require("express")
const router = express.Router()
const bitcoin = require("../../Network")

// receive a hash block and return the details about that block
router.get('/block/:blockHash', function(req, res) {
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
router.get('/transaction/:transactionId', function(req, res) {
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
router.get('/address/:address', function(req, res) {
    const address = req.params.address

    result = bitcoin.getAddressData(address)

    res.json({
        note: "Address Data fetched successfully.",
        addressTransactions: result.addressTransactions,
        addressBalance: result.addressBalance
    })
})

router.get('/', function(req, res) {
    res.sendFile('./block-explorer/index.html', {root: __dirname})
})

module.exports = router