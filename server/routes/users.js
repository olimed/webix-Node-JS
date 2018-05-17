const express = require("express"),
	router = express.Router({mergeParams: true});
const db = require("../models/db");

router.get("/users", (req, res) => {
	
	db.users.findAll().then( (data, err) => {	
		
		if (err) {
			console.log("ERROR!");
		} else {
			res.json(data);
		}
	});	
});

router.put("/users/:id", (req, res) => {
	db.users.findById(req.body.id).then((user)=>{
		user.update({
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			email: req.body.email
		}).then( (err) => {
			if (err) {
				console.log("ERROR!");
			} else {
				res.json({});
			}
		});
	});
}); 

module.exports = router;