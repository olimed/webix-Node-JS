const Sequelize = require("sequelize");
const config = require("../config");
const sequelize = new Sequelize( config.get("db:name"), config.get("db:login"), config.get("db:password"), {
	host: config.get("db:host"),
	dialect: config.get("db:dialect")
});

/*sequelize.sync({force: true}).then( () => {
	user.create({
		firstName: "Alex", 
		lastName: "Davidson",
		email: "davidson@mail.com"
	});
	book.create({
		title: "Gone with the Wind", 
		author: "Margaret Mitchell",
		size: "300",
		status: "open",
		userId: 1
	});
	user.create({
		firstName: "Mark", 
		lastName: "Colman",
		email: "MCoolman@mail.com"
	});
	book.create({
		title: "Dracula", 
		author: "Bram Stoker",
		size: "150",
		status: "close",
		userId: 2
	});
});*/

let db = {
	users: sequelize.import(`${__dirname}/user.js`),
	books: sequelize.import(`${__dirname}/book.js`),
	sequelize: sequelize,
	Sequelize: Sequelize
};

module.exports = db;