import { JetView } from "webix-jet";
import { users } from "models/users";
import editWindow from "views/editForm";

export default class UsersTableView extends JetView {
	config() {

		let toolbar = {
			view: "toolbar",
			id: "users:toolbar",
			cols: [
				{
					view: "button", id: "toolbar:export", label: "Export to Excel", type: "iconButton", icon: "excel",
					click: () => {
						webix.toExcel(this.$$("users:datatable"));
					}
				},
				{
					view: "button", id: "toolbar:refresh", label: "Refresh", type: "iconButton", icon: "sync",
					click: () => {
						this.$$("users:datatable").clearAll();
						this.$$("users:datatable").load("http://localhost:3000/users");
					}
				},
				{}
			]
		};

		let usersDatatable = {
			view: "datatable",
			id: "users:datatable",
			scrollX: false,
			select: true,
			columns: [
				this.addColumn( "firstName", "User name", true, 0),
				this.addColumn( "lastName", "Last name", false, 250),
				this.addColumn( "email", "Email", false, 250)
			],
			on: {
				onItemClick: (id) => {
					let item = users.getItem(id);
					this.editWindow.showWindow(item);
				},
				onAfterSelect: (id) => {
					this.show(`users?id=${id}`);
				}
			}
		};

		let view = {
			rows: 
				[toolbar, usersDatatable]
		};

		return view;
	}

	init() {
		this.$$("users:datatable").sync(users);

		this.editWindow = this.ui(editWindow);
	}

	addColumn( idValue, headerValue, fillspaceValue, widthValue){
		let column = { id: idValue, header: [ headerValue, { content: "textFilter" }], sort: "string"};
		if (fillspaceValue) {
			column.fillspace = fillspaceValue;
		} else if (widthValue) {
			column.width = widthValue;
		}
		return column;
	}
}