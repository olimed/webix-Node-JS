import { JetView } from "webix-jet";
import { users } from "models/users";
import { books } from "models/books";
import  templateForList from "views/layouts/listInfo.hbs";
import  templateForBook from "views/layouts/templateInfo.hbs";

export default class InfoView extends JetView {
	config() {

		let usersList = {
			view: "list",
			localId: "info:list",
			width: 250,
			scrollX: false,
			select: true,
			type: {
				height: 60
			},
			template: (obj) => {
				let objtemp = {
					firstName: obj.firstName,
					lastName: obj.lastName,
					email: obj.email
				};
	
				return templateForList(objtemp);
			},
			on: {
				onAfterSelect: () => {
					this.$$("info:template").hide();
					this.$$("info:datatable").filter((obj) => {
						let item = this.$$("info:list").getSelectedItem();
						return obj.userId == item.id;
					});
				}
			}
		};

		let booksDatatable = {
			view: "datatable",
			localId: "info:datatable",
			scrollX: false,
			select: true,
			editable: true,
			columns: [
				this.addColumn( "title", "Title", true, 0),
				this.addColumn( "author", "Author", 0, 300),
				this.addColumn( "size", "Size (kb)", 0, 100)
			],

			on: {
				onAfterEditStop: () => {
					let datatable = this.$$("info:datatable");
					let values = datatable.getSelectedItem();
					datatable.updateItem(values.id, values);
					this.$$("info:template").setValues(values);
				},
				onAfterSelect: () => {
					let values = this.$$("info:datatable").getSelectedItem();
					let template = this.$$("info:template");
					template.setValues(values);
					template.show();					
				}
			}
		};

		let bookTemplate = {
			view: "template",
			id: "info:template",
			template: (obj) => {
				let template = {
					title: obj.title,
					author: obj.author
				};
				return templateForBook(template);
			}

		};

		let view = {
			cols: [
				usersList, 
				{ rows: [booksDatatable, bookTemplate] }
			]
		};

		return view;
	}

	init() {
		books.waitData.then(() => {
			this.$$("info:datatable").sync(books);
		});
		users.waitData.then(() => {
			let list = this.$$("info:list");
			list.sync(users);
			list.select(users.getFirstId());
		});

		this.$$("info:template").hide();
	}

	addColumn( id, header, fillspace, width){
		let column = { id: id, editor: "text", header: header};
		if (fillspace){
			column.fillspace = fillspace;
		}
		if (width){
			column.width = width;
		}
		return column;
	}
}