const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

let users = require("../server/routes/users");
app.get("/users", users.getData);
app.put("/users/:id", users.updateItem);

let books = require("../server/routes/books");
app.get("/books", books.getData);
app.put("/books/:id", books.updateItem);
app.post("/books", books.upload);
app.delete("/books/:id", books.delete);
+app.get("/dynamicbooks", books.getDataDynamic);

app.listen(port, () => {
    console.log(`server is running at localhost:${port}`);
});