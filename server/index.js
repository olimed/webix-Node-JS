const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const config = require("./config");

let port = process.env.PORT || config.get("port");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

let users = require("../server/routes/users");
let books = require("../server/routes/books");

app.use(users);
app.use(books);

app.listen(port, () => {
	console.log(`server is running at localhost:${port}`);
});