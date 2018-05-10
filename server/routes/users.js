let db = require("../db");

module.exports = {
	getData: (req, res) => {
		db.user.findAll().then(data => res.json(data));		
	},
	updateItem: (req, res) => {
		db.user.findById(req.body.id).then((user)=>{
			user.update({
				firstName: req.body.firstName,
				lastName: req.body.lastName,
				email: req.body.email
			}).then(() => res.json({}));
		});
	}
};