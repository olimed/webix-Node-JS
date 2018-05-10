import { JetView } from "webix-jet";
import { users } from "models/users";
import { books } from "models/books";

export default class InfoView extends JetView {
	config() {

		let usersList = {
			view: "list",
			width: 250,
			scrollX: false,
			select: true,
			type: {
				height: 60
			},
			template: (obj) => {
				return `
					<div id='wrapper'>
						<div id='avatar'> 
							<span class='webix_icon fa-user-circle icon-avatar'></span>
						</div>
						<div> 
							${obj.firstName} ${obj.lastName}
							<div>${obj.email}</div>
						</div>
					</div>
				`;
			},
			on: {
				onAfterSelect: () => {
					this.getRoot().queryView({ view: "template", name: "preview" }).hide();
					this.getRoot().queryView({ view: "datatable" }).filter((obj) => {
						let item = this.getRoot().queryView({ view: "list" }).getSelectedItem();
						return obj.userId == item.id;
					});
				}
			}
		};

		let booksDatatable = {
			view: "datatable",
			scrollX: false,
			select: true,
			editable: true,
			columns: [
				{ id: "title", editor: "text", header: "Title", fillspace: true },
				{ id: "author", editor: "text", header: "Author", width: 300 },
				{ id: "size", editor: "text", header: "Size (kb)", width: 100 }
			],

			on: {
				onAfterEditStop: () => {
					let datatable = this.getRoot().queryView({ view: "datatable" });
					let values = datatable.getSelectedItem();
					datatable.updateItem(values.id, values);
					this.getRoot().queryView({ view: "template", name: "preview" }).setValues(values);
				},
				onAfterSelect: () => {
					let values = this.getRoot().queryView({ view: "datatable" }).getSelectedItem();
					let template = this.getRoot().queryView({ view: "template", name: "preview" });
					template.setValues(values);
					template.show();
					//this.show(`users?id=${id}`);					
				}
			}
		};

		let bookTemplate = {
			view: "template",
			name: "preview",
			template: (obj) => {
				return `
					<div id='info-header'>
						<div id = 'title'>
						<h1 style='padding-left:18px; min-height: 40px;'>${obj.title}</h1>
						<h2 style='padding-left:18px; min-height: 40px;'>${obj.author}</h2>
						<br>
						</div>
					</div>				
				`;
			}

		};

		return { cols: [usersList, { rows: [booksDatatable, bookTemplate] }] };
	}

	init(view) {
		books.waitData.then(() => {
			view.queryView({ view: "datatable" }).sync(books);
		});
		users.waitData.then(() => {
			let list = view.queryView({ view: "list" });
			list.sync(users);
			list.select(users.getFirstId());
		});

		view.queryView({ view: "template", name: "preview" }).hide();
	}
}