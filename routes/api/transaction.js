const express = require("express");
const router = express.Router();
const Blockchain = require("../../dev/blockchain");
const bitcoin = new Blockchain();

// creates a new transaction and adds it to the pending transactions
router.post("/transaction", function (req, res) {
  const newTransaction = req.body;
  let blockIndex = bitcoin.addTransactionToPendingTransactions(newTransaction);

  res.json({
    note: `New transaction will be added to block #${blockIndex}`,
  });
});

// creates new transaction AND will broadcast that transaction to all nodes
router.post("/transaction/broadcast", function (req, res) {
  let amount = req.body.amount;
  let sender = req.body.sender;
  let recipient = req.body.recipient;

  const newTransaction = bitcoin.createNewTransaction(
    amount,
    sender,
    recipient
  );
  bitcoin.addTransactionToPendingTransactions(newTransaction);

  const requestPromises = [];
  bitcoin.networkNodes.forEach((networkNodeURL) => {
    const requestOptions = {
      uri: networkNodeURL + "/transaction",
      method: "POST",
      body: newTransaction,
      json: true,
    };

    requestPromises.push(rp(requestOptions));
  });

  Promise.all(requestPromises).then((data) => {
    res.json({
      note: "Transaction created and broadcast successfully.",
    });
  });
});

module.exports = router;
