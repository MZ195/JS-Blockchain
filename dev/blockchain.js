const uuid = require('uuid')
const sha256 = require('sha256')

const currentNodeURL = process.argv[3]

function Blockchain() {
    // This array will hold all verified blocks
    this.chain = [] 
    // this array will hold a list of transactions before they are placed in a block and mined
    this.pendingTransactions = []
    // genesis block
    this.createNewBlock(100, '0', '0')
    // the url of the hosting node
    this.currentNodeURL = currentNodeURL
    // the list of all nodes in the network
    this.networkNodes = []
}

Blockchain.prototype.createNewBlock = function(nonce, previousBlockHash, hash) {
    const newBlock = {
        index: this.chain.length + 1,
        timestamp: Date.now(),
        transactions: this.pendingTransactions,
        nonce: nonce,
        hash: hash,
        previousBlockHash: previousBlockHash
    }

    this.pendingTransactions = []
    this.chain.push(newBlock)
    return newBlock
}

Blockchain.prototype.getLastBlock = function() {
    return this.chain[this.chain.length - 1]
}

Blockchain.prototype.createNewTransaction = function(amount, sender, recipient) {
    // we need unique ID for each transaction
    const newTransaction = {
        amount: amount,
        sender: sender,
        recipient: recipient,
        transactionId: uuid.v1().split('-').join('')
    }

    return newTransaction
}

Blockchain.prototype.addTransactionToPendingTransactions = function(transactionObj) {
    this.pendingTransactions.push(transactionObj)
    return this.getLastBlock['index'] + 1
}

Blockchain.prototype.hashBlock = function(previousBlockHash, currentBlockData, nonce) {
    let dataAsString = previousBlockHash + JSON.stringify(currentBlockData) + nonce.toString()
    let hash = sha256(dataAsString)
    return hash
}

Blockchain.prototype.proofOfWork = function(previousBlockHash, currentBlockData) {
    // repeatedly hash the block until it finds correct hash => '00004dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824'
    // uses current block data and previous block hash to compute the new hash
    // continouusly changes the nonce value until it finds the correct hash
    // returns the nonce value that produced the correct hash

    let nonce = 0
    let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce)

    while(hash.substring(0, 4) !== '0000'){
        nonce++
        hash = this.hashBlock(previousBlockHash, currentBlockData, nonce)
    }

    return nonce
}


module.exports = Blockchain