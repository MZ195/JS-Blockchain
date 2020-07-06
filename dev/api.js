const uuid = require('uuid')
const morgan = require('morgan')
const express = require('express')
const bodyParser = require('body-parser')

const Blockchain = require('./blockchain')

const app = express()
const bitcoin = new Blockchain()

// node address to each node in the network
const nodeAddress = uuid.v1().split('-').join('')

app.use(bodyParser.json())
app.use(morgan('combined'))
app.use(bodyParser.urlencoded({extended: false}))


app.get('/blockchain', function (req, res) {
    res.send(bitcoin)
})

app.post('/transaction', function (req, res) {
    let amount = req.body.amount
    let sender = req.body.sender
    let recipient = req.body.recipient

    const blockIndex = bitcoin.createNewTransaction(amount, sender, recipient)
    res.json({
        note: `Transaction will be added to block ${blockIndex}.`
    })
})

app.get('/mine', function (req, res) {
    const lastBlock = bitcoin.getLastBlock()
    const previousBlockHash = lastBlock['hash']
    const currentBlockData = {
        transactions: bitcoin.pendingTransactions,
        index: lastBlock['index'] + 1
    }

    const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData)
    const hash = bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce)

    // reward for the mining node
    bitcoin.createNewTransaction(12.5, "00", nodeAddress)

    const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, hash)

    res.json({
        note: `New block mined successfully`,
        block: newBlock
    })
})

app.listen(8989, function () {
    console.log('Listening on port 8989...')
})