const express = require("express");
const router = express.Router();
const requestPromise = require("request-promise");
const Blockchain = require("../../dev/blockchain");
const bitcoin = new Blockchain();

// register the new node and broadcast it's URL to other nodes in the network
router.post("/register-and-broadcast-node", function (req, res) {
  const newNodeURL = req.body.newNodeURL;

  if (bitcoin.networkNodes.indexOf(newNodeURL) == -1)
    bitcoin.networkNodes.push(newNodeURL);

  const regNodesPromises = [];

  bitcoin.networkNodes.forEach((networkNodeURL) => {
    // we need to hit /register-node endpoint for all other nodes
    const requestOptions = {
      uri: networkNodeURL + "/register-node",
      method: "POST",
      body: { newNodeURL: newNodeURL },
      json: true,
    };
    // since we don't know how long each request might take
    // it's better to send them all at once and collect the responses later.
    regNodesPromises.push(rp(requestOptions));
  });

  // promise all will excute all the requests in regNodesPromises
  Promise.all(regNodesPromises)
    .then((data) => {
      // this chunk of code will be excuted after all requests are completed successfully
      // we will be bulk registering all network nodes to the new node
      const bulkRegisterOptions = {
        uri: newNodeURL + "/register-nodes-bulk",
        method: "POST",
        body: {
          allNetworkNodes: [...bitcoin.networkNodes, bitcoin.currentNodeURL],
        },
        json: true,
      };
      rp(bulkRegisterOptions);
    })

    .then((data) => {
      // we will send back a note to the new node
      res.json({
        note: "New Node registered with network successfully",
      });
    });
});

module.exports = router;
