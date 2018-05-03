import { JetView } from "webix-jet";
import { users } from "models/users";
import { books } from "models/books";

export default class SettingsView extends JetView {
	config() {

		let chechboxes = {
			cols: [
				{
					view: "checkbox", id: "hideUpload", label: "Hide upload", value: 0, labelWidth: 100,
					click: () => {

					}
				},
				{
					view: "checkbox", id: "hideTable", label: "Hide table", value: 0, labelWidth: 100,
					click: () => {

					}
				},
				{
					view: "checkbox", id: "hideDelete", label: "Hide delete", value: 0, labelWidth: 100,
					click: () => {

					}
				}
			]
		};

		let booksUploader = {
			rows: [
				{ 
					view: "uploader", autosend: false, multiple: false,
					label: "upload book", type: "iconButton", icon: "cloud-upload", css: "style_button",
					id: "setting:upload",
					link: "upload:list",
					on: {
						onAfterFileAdd: (upload) => {
							let file = upload.file;
							let reader = new FileReader();
							let id = this.getRoot().queryView({view: "gridsuggest"}).getValue();
							file.userId = id;
							books.add(file);
							reader.readAsDataURL(file);
							return false;
						}
					}
				},
				{
					view: "list",
					type: "uploader",
					id: "upload:list",
					autoheight:true, 
					borderless:true
				},
				{}
			]
		};

		let multicomboForDel = {
			labelPosition: "top",
			view: "multicombo",
			label: "Delete book",
			suggest: {
				body: {
					data: books,
					template: "#title#"
				}
			}

		};

		let grid = {
			view: "toolbar",
			elements: [
				{ view: "label", label: "Select" },
				{
					view: "richselect",
					suggest: {
						view: "gridsuggest",
						template: (item) => {
							return item.firstName + " " + item.lastName;
						},
						body: {
							autoConfig: true,
							data: users
						}
					}
				}
			]

		};

		let datatable = {
			view: "datatable",
			name: "settings:datatable",
			select: true,
			columns: [
				{ id: "title", header: ["Title", { content: "textFilter" }], sort: "string", fillspace: true },
				{ id: "author", header: ["Author", { content: "textFilter" }], sort: "string" },
				{ id: "size", header: ["Size", { content: "textFilter" }], sort: "string" }
			],
		};

		var form = {
			view: "form",
			id: "settings:form",
			elements: [
				{
					cols: [
						{ rows: [chechboxes, booksUploader] },
						{ rows: [grid, datatable, multicomboForDel] }
					]
				}
			]
		};

		return form;
	}

	init() {
		this.getRoot().queryView( {view: "datatable", name: "settings:datatable"}).sync(books);
	}
}