"use strict";

const authorize = require("../services/auth/auth");
const Role = require("../roles/roles");

module.exports = function(app) {
	var todoList = require("../controllers/user");

	// todoList Routes
	app
		.route("/users")
		.get(todoList.list_all_users)
		.post(todoList.create_a_user);

	app
		.route("/users/:userId")
		.get(todoList.read_a_user)
		.put(todoList.update_a_user)
		.delete(todoList.delete_a_user)
		.patch(todoList.modifyUser);

	app.route("/authenticate").post(todoList.authenticate); // public route

	app.route("/resetToken").get(todoList.refreshToken); // public route

	//app.route("/testNow").get(todoList.GenerateBoulpikNumber);

	//app.route("/transactions").post(authorize.ensureAuthenticated, authorize.Admins, todoList.doTransactions);
	//app.route("/gifs").post(authorize.ensureAuthenticated, todoList.gifsTransactions);
};
