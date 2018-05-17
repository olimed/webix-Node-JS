import { JetView } from "webix-jet";

export default class BookTableView extends JetView {
	config() {

		let booktable = {
			view: "datatable",
			localId: "books:datatable",
			scrollX: false,
			select: true,
			editable: true,
			datafetch: 30,
			loadahead: 30,
			columns: [
				this.addColumn( "title", "Title", 2),
				this.addColumn( "author", "Author", 2),
				this.addColumn( "size", "Size", 1),	
				this.addColumnSelect( "status", "Status", 1)
			],
			url: "http://localhost:3000/dynamicbooks",
			save: "rest->http://localhost:3000/books",
			on: {
				onAfterEditStop: () => {
					let datatable = this.$$("books:datatable");
					let values = datatable.getSelectedItem();
					datatable.updateItem(values.id, values);
				}
			}
		};

		return booktable;
	}

	addColumn( id, header, fillspace){
		return {id: id, editor:"text", header: [ header, {content:"serverFilter"}], sort:"server", fillspace: fillspace};
	}
	addColumnSelect(id, header, fillspace){
		return { id: id, editor: "select", header: [ header, { content: "selectFilter" }], sort: "server", options: [{id: "open", value: "open"}, {id: "close", value: "close"}], fillspace: fillspace};
	}
}