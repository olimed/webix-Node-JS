const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {

	const book = sequelize.define("book", {
		title: Sequelize.STRING,
		author: Sequelize.STRING,
		size: Sequelize.STRING,
		status: Sequelize.STRING,
		userId: Sequelize.INTEGER
	}, {
		classMethods: {
			associate: (models) => {
				book.belongsTo(models.user);
			}
		}
	});
	
	return book;
};