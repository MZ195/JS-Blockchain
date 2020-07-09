const Blockchain = require('./blockchain')
const bitcoin = new Blockchain()
const bc1 = {
    "chain": [
        {
            "index": 1,
            "timestamp": 1594190811903,
            "transactions": [],
            "nonce": 100,
            "hash": "0",
            "previousBlockHash": "0"
        },
        {
            "index": 2,
            "timestamp": 1594190879901,
            "transactions": [],
            "nonce": 192133,
            "hash": "000073e7d35d35be0861f043cae54db47715fe0d145fd49bd5964140949f2a31",
            "previousBlockHash": "0"
        },
        {
            "index": 3,
            "timestamp": 1594190890712,
            "transactions": [
                {
                    "amount": 12.5,
                    "sender": "0000000000000000000000000000000000000000000000000000000000000000",
                    "recipient": "cdfb48f0c0e611ea8d73cfb567208f6c",
                    "transactionId": "f6858ce0c0e611ea8d73cfb567208f6c"
                }
            ],
            "nonce": 2217,
            "hash": "0000600c0e4f03934bd1c1669822348d8c6d4000486caeec8c4b0ade76cb5e9e",
            "previousBlockHash": "000073e7d35d35be0861f043cae54db47715fe0d145fd49bd5964140949f2a31"
        },
        {
            "index": 4,
            "timestamp": 1594190891538,
            "transactions": [
                {
                    "amount": 12.5,
                    "sender": "0000000000000000000000000000000000000000000000000000000000000000",
                    "recipient": "cdfb48f0c0e611ea8d73cfb567208f6c",
                    "transactionId": "fcf4e3a0c0e611ea8d73cfb567208f6c"
                }
            ],
            "nonce": 9507,
            "hash": "0000dc68837704d4fc63fbf56f38d868440edea8efd3bc04ac2bbf195e180181",
            "previousBlockHash": "0000600c0e4f03934bd1c1669822348d8c6d4000486caeec8c4b0ade76cb5e9e"
        },
        {
            "index": 5,
            "timestamp": 1594190892305,
            "transactions": [
                {
                    "amount": 12.5,
                    "sender": "0000000000000000000000000000000000000000000000000000000000000000",
                    "recipient": "cdfb48f0c0e611ea8d73cfb567208f6c",
                    "transactionId": "fd72ed40c0e611ea8d73cfb567208f6c"
                }
            ],
            "nonce": 24222,
            "hash": "0000773e8e96bb32d6c995a670986ddc68070428ce36d047523891d5a5b65d0e",
            "previousBlockHash": "0000dc68837704d4fc63fbf56f38d868440edea8efd3bc04ac2bbf195e180181"
        },
        {
            "index": 6,
            "timestamp": 1594190892901,
            "transactions": [
                {
                    "amount": 12.5,
                    "sender": "0000000000000000000000000000000000000000000000000000000000000000",
                    "recipient": "cdfb48f0c0e611ea8d73cfb567208f6c",
                    "transactionId": "fde7f630c0e611ea8d73cfb567208f6c"
                }
            ],
            "nonce": 14361,
            "hash": "0000df0a5206983c62ae834ddce2c874936c09c12e31f33cd2341a7d39d8c4d7",
            "previousBlockHash": "0000773e8e96bb32d6c995a670986ddc68070428ce36d047523891d5a5b65d0e"
        },
        {
            "index": 7,
            "timestamp": 1594190895313,
            "transactions": [
                {
                    "amount": 12.5,
                    "sender": "0000000000000000000000000000000000000000000000000000000000000000",
                    "recipient": "cdfb48f0c0e611ea8d73cfb567208f6c",
                    "transactionId": "fe42c060c0e611ea8d73cfb567208f6c"
                }
            ],
            "nonce": 327763,
            "hash": "0000ffb717d1c247770b69b20580d83e70a8ef4e02cc34602c4f53e879b2557c",
            "previousBlockHash": "0000df0a5206983c62ae834ddce2c874936c09c12e31f33cd2341a7d39d8c4d7"
        },
        {
            "index": 8,
            "timestamp": 1594190897182,
            "transactions": [
                {
                    "amount": 12.5,
                    "sender": "0000000000000000000000000000000000000000000000000000000000000000",
                    "recipient": "cdfb48f0c0e611ea8d73cfb567208f6c",
                    "transactionId": "ffb31940c0e611ea8d73cfb567208f6c"
                }
            ],
            "nonce": 93254,
            "hash": "0000aef66d2dc93833172b5f5a6c0523f74ef70249cca533c4bc3827ca498c05",
            "previousBlockHash": "0000ffb717d1c247770b69b20580d83e70a8ef4e02cc34602c4f53e879b2557c"
        },
        {
            "index": 9,
            "timestamp": 1594191047310,
            "transactions": [
                {
                    "amount": 12.5,
                    "sender": "0000000000000000000000000000000000000000000000000000000000000000",
                    "recipient": "cdfb48f0c0e611ea8d73cfb567208f6c",
                    "transactionId": "00d02200c0e711ea8d73cfb567208f6c"
                },
                {
                    "amount": 9090,
                    "sender": "JH56G756JGHF743JK5GF",
                    "recipient": "JH45FGD6J6H475J",
                    "transactionId": "50125ae0c0e711ea8d73cfb567208f6c"
                },
                {
                    "amount": 12,
                    "sender": "JH56G756JGHF743JK5GF",
                    "recipient": "JH45FGD6JKH475J",
                    "transactionId": "5364e140c0e711ea8d73cfb567208f6c"
                },
                {
                    "amount": 33,
                    "sender": "JH56G756JGHF743JK5GF",
                    "recipient": "JH45FGD6J6H475J",
                    "transactionId": "549f0ef0c0e711ea8d73cfb567208f6c"
                },
                {
                    "amount": 34534,
                    "sender": "JH56G756JGHF743JK5GF",
                    "recipient": "JH45FGD6J6H475J",
                    "transactionId": "563b80e0c0e711ea8d73cfb567208f6c"
                }
            ],
            "nonce": 63960,
            "hash": "000089c6261827bd521215e65188bb0124078d13ba6b9bbe517668067eb3ee19",
            "previousBlockHash": "0000aef66d2dc93833172b5f5a6c0523f74ef70249cca533c4bc3827ca498c05"
        },
        {
            "index": 10,
            "timestamp": 1594191087171,
            "transactions": [
                {
                    "amount": 12.5,
                    "sender": "0000000000000000000000000000000000000000000000000000000000000000",
                    "recipient": "cdfb48f0c0e611ea8d73cfb567208f6c",
                    "transactionId": "5a4bd900c0e711ea8d73cfb567208f6c"
                },
                {
                    "amount": 66,
                    "sender": "JH56G756JGHF743JK5GF",
                    "recipient": "JH45FGD6J6H475J",
                    "transactionId": "694d8d90c0e711ea8d73cfb567208f6c"
                },
                {
                    "amount": 766,
                    "sender": "JH56G756JGHF743JK5GF",
                    "recipient": "JH45FGD6J6H475J",
                    "transactionId": "6a95c500c0e711ea8d73cfb567208f6c"
                },
                {
                    "amount": 8744,
                    "sender": "JH56G756JGHF743JK5GF",
                    "recipient": "JH45FGD6J6H475J",
                    "transactionId": "6c3dcfb0c0e711ea8d73cfb567208f6c"
                },
                {
                    "amount": 453,
                    "sender": "JH56G756JGHF743JK5GF",
                    "recipient": "JH45FGD6J6H475J",
                    "transactionId": "6e07e150c0e711ea8d73cfb567208f6c"
                }
            ],
            "nonce": 1558,
            "hash": "0000d1074c9008f0e8d04612b626e564a50cc342c3d5132164e45b11d9da902b",
            "previousBlockHash": "000089c6261827bd521215e65188bb0124078d13ba6b9bbe517668067eb3ee19"
        }
    ],
    "pendingTransactions": [
        {
            "amount": 12.5,
            "sender": "0000000000000000000000000000000000000000000000000000000000000000",
            "recipient": "cdfb48f0c0e611ea8d73cfb567208f6c",
            "transactionId": "720e4e60c0e711ea8d73cfb567208f6c"
        }
    ],
    "currentNodeURL": "http://localhost:9091",
    "networkNodes": []
}


console.log('Valid: ', bitcoin.chainIsValid(bc1.chain))