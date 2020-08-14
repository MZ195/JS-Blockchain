const uuid = require("uuid");
const morgan = require("morgan");
const express = require("express");
const rp = require("request-promise");
const bodyParser = require("body-parser");

// getting the port from the command
const port = process.argv[2];

const requestPromise = require("request-promise");

const app = express();

// unique node address to each node in the network
const nodeAddress = uuid.v1().split("-").join("");

app.use(bodyParser.json());
app.use(morgan("combined"));
app.use(bodyParser.urlencoded({ extended: false }));
