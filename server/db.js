let Sequelize = require("sequelize");
let sequelize = new Sequelize("webixtestapp", "root", "",{
	host:"localhost",
	dialect:"mysql"
});

let user = sequelize.define("user", {
	firstName: Sequelize.STRING,
	lastName: Sequelize.STRING,
	email: Sequelize.STRING
});

let book = sequelize.define("book", {
	title: Sequelize.STRING,
	author: Sequelize.STRING,
	size: Sequelize.STRING,
	status: Sequelize.STRING,
	userId: Sequelize.INTEGER
});
		
user.hasMany(book);

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

module.exports = {
	user, book
};