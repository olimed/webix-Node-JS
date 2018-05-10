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
						let uploadButton = this.getRoot().queryView({ view: "uploader", autosend: false });
						let uploadList = this.getRoot().queryView({ view: "list", type: "uploader" });
						if (this.$$("hideUpload").getValue()) {
							uploadButton.hide();
							uploadList.hide();
						} else {
							uploadButton.show();
							uploadList.show();
						}
					}
				},
				{
					view: "checkbox", id: "hideTable", label: "Hide table", value: 0, labelWidth: 100,
					click: () => {
						let table = this.getRoot().queryView({ view: "datatable", name: "settings:datatable", });
						this.$$("hideTable").getValue() ? table.hide() : table.show();
					}
				},
				{
					view: "checkbox", id: "hideDelete", label: "Hide delete", value: 0, labelWidth: 100,
					click: () => {
						let deleteButton = this.getRoot().queryView({ view: "button", label: "Delete" });
						let multicombo = this.getRoot().queryView({ view: "multicombo", label: "Delete book" });
						if (this.$$("hideDelete").getValue()) {
							deleteButton.hide();
							multicombo.hide();
						} else {
							deleteButton.show();
							multicombo.show();
						}
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
					upload: "http://localhost:3000/books",
					on: {
						onAfterFileAdd: (upload) => {
							let id = this.getRoot().queryView({ view: "toolbar" }).getChildViews()[1].getValue();
							let file = upload.file;
							let reader = new FileReader();
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
					autoheight: true,
					borderless: true
				},
				{}
			]
		};

		let multicomboForDel = {
			labelPosition: "top",
			view: "multicombo",
			label: "Delete book",
			height: 250,
			suggest: {
				body: {
					data: books,
					template: "#title#"
				}
			}
		};

		let deleteButton = {
			view: "button",
			label: "Delete",
			click: () => {
				let multicombo = this.getRoot().queryView({ view: "multicombo", label: "Delete book" });
				let values = multicombo.getValue();
				values = values.split(",");
				let length = values.length;
				for (let i = 0; i < length; i++) {
					books.remove(values[i]);
				}
				multicombo.refresh();
				multicombo.setValue();
				this.filterTable();
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
						name: "settings:gridsuggest",
						template: (item) => {
							return item.firstName + " " + item.lastName;
						},
						body: {
							columns: [
								{ id: "firstName" },
								{ id: "lastName" }
							],
							data: users
						}
					},
					on: {
						onChange: () => {
							let id = this.getRoot().queryView({ view: "toolbar" }).getChildViews()[1].getValue();
							if (id) {
								let userBooks = [];
								this.getRoot().queryView({ view: "uploader", autosend: false }).enable();
								this.getRoot().queryView({ view: "button", label: "Delete" }).enable();
								this.getRoot().queryView({ view: "datatable" }).filter((obj) => {
									if (obj.userId == id) {
										userBooks.push(obj);
										return obj;
									}
								});
								let multicombo = this.getRoot().queryView({ view: "multicombo", label: "Delete book" });
								multicombo.setValue(userBooks);
								multicombo.refresh();
							} else
								webix.message({ type: "error", text: "Please, choose user in Select" });

						}
					}
				}
			]

		};

		let datatable = {
			view: "datatable",
			name: "settings:datatable",
			select: true,
			scrollX: false,
			columns: [
				{ id: "title", header: ["Title", { content: "textFilter" }], sort: "string", fillspace: true },
				{ id: "status", header: ["Status", { content: "selectFilter" }], sort: "string", options: [{id: "open", value: "open"}, {id: "close", value: "close"}] },
				{ id: "size", header: ["Size", { content: "textFilter" }], sort: "string" }
			],
			on: {
				onAfterFilter: () => {
					this.filterTable();
					console.log(1);
				}
			}
		};

		let form = {
			view: "form",
			id: "settings:form",
			elements: [
				{
					cols: [
						{ rows: [chechboxes, booksUploader] },
						{ rows: [grid, datatable, multicomboForDel, deleteButton] }
					]
				}
			]
		};

		return form;
	}

	init() {
		let table = this.getRoot().queryView({ view: "datatable", name: "settings:datatable" });
		table.sync(books);
		this.getRoot().queryView({ view: "uploader", autosend: false }).disable();
		this.getRoot().queryView({ view: "button", label: "Delete" }).disable();
		let multicombo = this.getRoot().queryView({ view: "multicombo", label: "Delete book" });
		multicombo.getPopup().getList().sync(table.data);
	}

	filterTable() {
		let id = this.getRoot().queryView({ view: "toolbar" }).getChildViews()[1].getValue();
		this.getRoot().queryView({ view: "datatable", name: "settings:datatable" }).filter((obj) => {
			return obj.userId == id;
		}, "", true);
	}
}