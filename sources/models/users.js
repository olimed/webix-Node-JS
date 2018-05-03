export const users = new webix.DataCollection({
	url:"http://localhost:3000/users",
	save:"rest->http://localhost:3000/users"
});