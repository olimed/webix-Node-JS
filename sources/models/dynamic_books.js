export const dynamicbooks = new webix.DataCollection({
	url:"http://localhost:3000/books",
	save:"rest->http://localhost:3000/books"
});