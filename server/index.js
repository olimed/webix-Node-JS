const express = require("express");
const cors = require("cors");
const app = express();

const port = process.env.PORT || 3000;

app.use(cors());

let users = require("../server/routes/users");
app.get("/users", users.getData);

let books = require("../server/routes/books");
app.get("/books", books.getData);

app.listen(port, () => {
	console.log(`server is running at localhost:${port}`);
});