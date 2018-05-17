const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {

	const user = sequelize.define("user", {
		firstName: Sequelize.STRING,
		lastName: Sequelize.STRING,
		email: Sequelize.STRING
	}, {
		classMethods: {
			associate: (models) => {
				user.hasMany(models.book);
			}
		}
	});

	return user;
};