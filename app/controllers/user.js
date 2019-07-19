"use strict";
const config = require("../../config");
const jwt = require("jsonwebtoken");
var async = require("async");
var mongoose = require("mongoose"),
	User = mongoose.model("UserExpress");
//const ServicesCredit = require("../services/credits/credits");
const ServicesAuth = require("../services/auth/auth");

exports.authenticate = async function(req, res, next) {
	var message = {};

	User.findOne(
		{ $or: [{ email: req.body.email }, { tel: req.body.email }] },
		// {
		// 	email: req.body.email
		// },
		function(err, user) {
			if (err) throw err;

			if (!user) {
				res.json({ success: false, message: "Authentication failed. User not found." });
			} else {
				// check if password matches
				if (user.etat == "0") {
					res.json({
						success: false,
						message: "Vous avez ete suspendu, Vous n'avez pas acces a rentrer dans le systeme."
					});
				} else if (user.motDePasse != req.body.motDePasse) {
					res.json({
						success: false,
						message: "Erreur avec le mot de passe. Veuillez Verifier votre Mot de Passe et essayer encore"
					});
				} else {
					/*if user role is  vendeur, and vendeur is not set in list caisse of day, put user in the list if the caisse state is open*/

					// if user is found and password is right
					// create a token

					//var token = jwt.sign(payload, app.get('superSecret'), {
					var token = jwt.sign({ sub: user._id, role: user.role }, config.secret, {
						expiresIn: 1200 // expires in 20 minutes
					});

					res.json({
						data: {
							user,
							token
						},
						success: true,
						message: message
					});
				}
			}
		}
	);
};

exports.list_all_users = function(req, res) {
	let message = "";
	User.find({}, "-motDePasse", function(err, user) {
		if (err) {
			res.json({ data: {}, success: false, message: err });
		} else {
			res.json({ data: user, success: true, message: message });
		}
	});
};

exports.create_a_user = async function(req, res) {
	let message = "";

	var new_user = new User(req.body);
	new_user.save(async function(err, user) {
		if (err) {
			res.json({ data: {}, success: false, message: err });
		} else {
			res.json({ data: user, success: true, message: message });
		}
	});
};

exports.read_a_user = async function(req, res) {
	let message = "";
	var _dataInfo = {};
	User.findById(req.params.userId, async function(err, user) {
		if (err) {
			res.json({ data: {}, success: false, message: err });
		} else {
			//console.log("user : ", user);

			res.json({ data: user, success: true, message: message });
		}
	});
};
exports.refreshToken = function(req, res) {
	var strToken = req.headers.authorization.split(" ")[1];
	//console.log(strToken);
	//var strToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1YzZmMGZkNzljY2U0NjAwMTc2ZmI1ZDQiLCJyb2xlIjoiZGlyZWN0b3IiLCJpYXQiOjE1NTEyMDU3NTIsImV4cCI6MTU1MTI5MjE1Mn0.XT5Id0FwlfS26k_R7rsLN-GHH_sX8gvwr6qKOkaCnPw";
	var message = {};
	var infoToken = jwt.decode(strToken);
	if (infoToken) {
		message = "successfull Token";
		var token = jwt.sign({ sub: infoToken.sub, role: infoToken.role }, config.secret, {
			expiresIn: 1200 // expires in 20 minutes
		});

		res.json({
			data: {
				token
			},
			success: true,
			message: message
		});
	} else {
		message = "Invalid Token";
		res.json({ data: {}, success: false, message: message });
	}

	console.log(infoToken);
};

exports.update_a_user = function(req, res) {
	let message = "";
	User.findOneAndUpdate({ _id: req.params.userId }, req.body, { new: true }, function(err, user) {
		if (err) {
			res.json({ data: {}, success: false, message: err });
		} else {
			res.json({ data: user, success: true, message: message });
		}
	});
};

exports.modifyUser = function(req, res) {
	let message = "";
	var updateObject = req.body;
	User.findOneAndUpdate({ _id: req.params.userId }, { $set: updateObject }, { new: true }, function(err, user) {
		if (err) {
			res.json({ data: {}, success: false, message: err });
		} else {
			res.json({ data: user, success: true, message: message });
		}
	});
};

exports.delete_a_user = function(req, res) {
	let message = "";

	User.remove(
		{
			_id: req.params.userId
		},
		function(err, user) {
			if (err) {
				res.json({ data: {}, success: false, message: err });
			} else {
				res.json({ data: user, success: true, message: message });
			}
		}
	);
};
