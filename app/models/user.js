function User (depot) {
	this.depot = depot
	this.data = depot.get("user");
}

User.exists = function () {
	return this.data != undefined
}
