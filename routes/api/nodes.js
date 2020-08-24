const express = require("express");
const router = express.Router();
const requestPromise = require("request-promise");
const Blockchain = require("../../dev/blockchain");
const bitcoin = new Blockchain();

// register the node on the network
router.post("/register-node", function (req, res) {
  const newNodeURL = req.body.newNodeURL;

  // check if the node already exists and the new node's url is not of this node
  if (
    bitcoin.networkNodes.indexOf(newNodeURL) == -1 &&
    bitcoin.currentNodeURL !== newNodeURL
  )
    bitcoin.networkNodes.push(newNodeURL);

  res.json({
    note: "New Node registered successfully.",
  });
});

// register multiple nodes at once in the new node
router.post("/register-nodes-bulk", function (req, res) {
  const allNetworkNodes = req.body.allNetworkNodes;
  allNetworkNodes.forEach((networkNodeURL) => {
    if (
      bitcoin.networkNodes.indexOf(networkNodeURL) == -1 &&
      bitcoin.currentNodeURL !== networkNodeURL
    )
      bitcoin.networkNodes.push(networkNodeURL);
  });

  res.json({
    note: "Bulk registration successful.",
  });
});

module.exports = router;
