import { JetView } from "webix-jet";

export default class BookTableView extends JetView {
	config() {

		var booktable = {
			view: "datatable",
			scrollX: false,
			select: true,
			editable: true,
			datafetch: 30,
			loadahead: 30,
			columns: [
				{id:"title", editor:"text", header: ["Title" , {content:"serverFilter"}], sort:"server",fillspace:2},
				{id:"author", editor:"text", header: ["Author", {content:"serverFilter"}], sort:"server",fillspace:2},
				{id:"size", editor:"text", header: ["Size", {content:"serverFilter"}], sort:"server",fillspace:1},
				{id:"status", editor:"select", header: ["Status", { content: "selectFilter" }], sort: "server", options: [{id: "open", value: "open"}, {id: "close", value: "close"}], fillspace:1},
			],
			url: "http://localhost:3000/books",
			save: "rest->http://localhost:3000/books",
			on: {
				onAfterEditStop: () => {
					let datatable = this.getRoot().queryView({view:"datatable"});
					let values = datatable.getSelectedItem();
					datatable.updateItem(values.id, values);
				}
			}
		};

		return booktable;
	}
}