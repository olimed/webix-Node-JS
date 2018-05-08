import { JetView } from "webix-jet";
import { users } from "models/users";
import editWindow from "views/editForm";

export default class UsersTableView extends JetView {
	config() {

		var toolbar = {
			view: "toolbar",
			id: "datasetA:toolbar",
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

		var usersDatatable = {
			view: "datatable",
			id: "users:datatable",
			scrollX: false,
			select: true,
			columns: [
				{ id: "firstName", header: ["User name", { content: "textFilter" }], sort: "string", fillspace: true },
				{ id: "lastName", header: ["Last name", { content: "textFilter" }], sort: "string", width: 250 },
				{ id: "email", header: ["Email", { content: "textFilter" }], sort: "string", width: 250 }
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



		return { rows: [toolbar, usersDatatable] };
	}

	init() {
		this.$$("users:datatable").sync(users);

		this.editWindow = this.ui(editWindow);
	}
}