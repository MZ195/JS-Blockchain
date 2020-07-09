# JS-Blockchain

## INTRODUCTION
The purpose of this project is to develop a solid understanding of how Blockchain technology works.
This project is a proof of concept. Hence, all implemented feature are related to how hashing can keep the chain secure from modifying from uh-honset nodes in the network.

## ABOUT BLOCKCHAIN
The goal of blockchain is to allow digital information to be recorded and distributed, but not edited.
“Blocks” on the blockchain are made up of digital pieces of information. Specifically, they have three parts:
1. Blocks store information about transactions like the date, time, and amount.
2. Blocks store information about who is participating in transactions.A purchase is recorded without any identifying information using a unique "digital signature".
3. Blocks store information that distinguishes them from other blocks. Each block stores a unique hash that allows us to tell it apart from every other block. 

## PROJECT DESCRIPTION
In this project, the backbone of a fully [`decentralized`](https://www.solarwindsmsp.com/blog/centralized-vs-decentralized-network) blockchain network was implemented.
Each node in the network have different endpoints that help keep the network synchronized by broadcasting new changes to all nodes.
![decentralized_network!](https://bestgpuformining.com/wp-content/uploads/2018/10/vrr.jpg)

The chain starts by the [`Genesis block`](https://en.bitcoin.it/wiki/Genesis_block). After that, every new transaction will be held pending untill we reach a predefined size for each block then the [`mining`](https://www.investopedia.com/terms/b/bitcoin-mining.asp) take place.

In mining, we keep hashing the transaction data using [`SHA256`](https://www.movable-type.co.uk/scripts/sha256.html) with a [`nonce`](https://www.investopedia.com/terms/n/nonce.asp) untill we finde a nonce that will produce a hash with a 4 leading 0s.

The number of zeros defines the difficulty of a blockchain, more zeros will result in more computation power to calculate the correct hash.

With thousands of nodes on the network, forks will happen. 
To keep the chain unified across the network the [`longest chain rule`](https://www.mangoresearch.co/blockchain-forks-explained/) is used to make sure only one version of the chain exists.

## PROJECT STRUCTURE
This project consist of two main files:

`blockchain.js` which have all needed methods access and modefiy the shared blockchain.

`networkNode.js` which is the Express server with all required endpoints to operate the network.

<pre> 
/dev/
|-- blockchain.js
|   |-- createNewBlock()
|   |-- getLastBlock()
|   |-- createNewTransaction()
|   |-- addTransactionToPendingTransactions()
|   |-- hashBlock()
|   |-- proofOfWork()
|   |-- chainIsValid()
|   |-- getBlock()
|   |-- getTransaction()
|   `-- getAddressData()
|
|-- networkNode.js
|   |-- GET '/mine'
|   |-- GET '/consensus'
|   |-- GET '/blockchain'
|   |-- POST '/transaction'
|   |-- POST '/receive-new-block'
|   |-- POST '/transaction/broadcast'
|   |-- POST /register-and-broadcast-node'
|   |-- POST '/register-node'
|   |-- POST '/register-nodes-bulk'
|   |-- GET '/block-explorer'
|   |-- GET '/block/:blockHash'
|   |-- GET '/transaction/:transactionId'
|   `-- GET '/address/:address'
|
`-- test.js
</pre> 


## HOW TO RUN
You can create multiple nodes by running networkNode.js on maultiple ports using a single machine.

Make sure you're in the /dev folder and run this
```Powershell
For ($i=1; $i -le 5; $i++) {
    invoke-expression "cmd /c start powershell -Command { nodemon.cmd --watch dev -e js networkNode.js 909$($i) http://localhost:909$($i)}"
}
```
