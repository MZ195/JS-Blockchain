const Blockchain = require('./blockchain');
const bitcoin = new Blockchain();

const previousBlockHash = 'IUGHHJKGKJH89';
const currentBlockData = [
    {
        amount: 101,
        sender: 'HGJ4H5FG674J5KH6FG5JK',
        recipient: 'JH77LHGLHJ73FL3JH7F'
    },
    {
        amount: 244,
        sender: 'DFGH7D8F86G78D9F6',
        recipient: 'LKH4G5674HJJK5H6'
    },
    {
        amount: 5467,
        sender: 'KLHJ45G6LK45G6HJ45G6',
        recipient: 'L5HK6G87LH7GK65JH7GK'
    }
];

console.log(bitcoin.proofOfWork(previousBlockHash, currentBlockData));
console.log(bitcoin.hashBlock(previousBlockHash, currentBlockData, 29303));