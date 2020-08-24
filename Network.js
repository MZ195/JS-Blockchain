const uuid = require("uuid");
const morgan = require("morgan");
const express = require("express");
const rp = require("request-promise");
const bodyParser = require("body-parser");

// getting the port from the command
const port = process.argv[2];

const app = express();
app.use(bodyParser.json());
app.use(morgan("combined"));
app.use(bodyParser.urlencoded({ extended: false }));

const broadcast = require("./routes/api/boradcasting");
const blockExplorer = require("./routes/api/blockExplorer");
const node = require("./routes/api/nodes");
const utils = require("./routes/api/utils");
const transaction = require("./routes/api/transaction");

app.use("/api/broadcast", broadcast);
app.use("/api/explorer/", blockExplorer);
app.use("/api/node/", node);
app.use("/api/utils/", utils);
app.use("/api/transaction/", transaction);

// unique node address to each node in the network
const nodeAddress = uuid.v1().split("-").join("");

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
