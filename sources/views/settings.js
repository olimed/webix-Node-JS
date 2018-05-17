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
						let views = [this.$$("settings:upload"), this.$$("upload:list")];
						this.visibaleViews( this.$$("hideUpload").getValue(), views);
					}
				},
				{
					view: "checkbox", id: "hideTable", label: "Hide table", value: 0, labelWidth: 100,
					click: () => {
						let views = [this.$$("settings:datatable")];
						this.visibaleViews( this.$$("hideTable").getValue(), views);
					}
				},
				{
					view: "checkbox", id: "hideDelete", label: "Hide delete", value: 0, labelWidth: 100,
					click: () => {
						let views = [this.$$("settings:buttonDelete"), this.$$("settings:multicombo")];
						this.visibaleViews( this.$$("hideDelete").getValue(), views);
					}
				}
			]
		};

		let booksUploader = {
			rows: [
				{
					view: "uploader", autosend: false, multiple: false,
					label: "upload book", type: "iconButton", icon: "cloud-upload", css: "style_button",
					id: "settings:upload",
					link: "upload:list",
					upload: "http://localhost:3000/books",
					on: {
						onAfterFileAdd: (upload) => {
							let id = this.$$("settings:toolbar").getChildViews()[1].getValue();
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
			id: "settings:multicombo",
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
			id: "settings:buttonDelete",
			label: "Delete",
			click: () => {
				let multicombo = this.$$("settings:multicombo");
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
			id: "settings:toolbar",
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
							let id = this.$$("settings:toolbar").getChildViews()[1].getValue();
							if (id) {
								let userBooks = [];
								this.$$("settings:upload").enable();
								this.$$("settings:buttonDelete").enable();
								this.$$("settings:datatable").filter((obj) => {
									if (obj.userId == id) {
										userBooks.push(obj);
										return obj;
									}
								});
								let multicombo = this.$$("settings:multicombo");
								multicombo.setValue(userBooks);
								multicombo.refresh();
							} else
								webix.message({ type: "error", text: "Please, choose user in Select" });

						}
					}
				}
			]

		};

		let items = [ 
			this.addColumn( "title", "Title", "textFilter"),
			this.addColumn( "status", "Status", "selectFilter"),
			this.addColumn( "size", "Size", "textFilter")
		];

		let options = [{id: "open", value: "open"}, {id: "close", value: "close"}];
		items[0].fillspace = true;
		items[1].options = options;

		let datatable = {
			view: "datatable",
			id: "settings:datatable",
			select: true,
			scrollX: false,
			columns: items,
			on: {
				onAfterFilter: () => {
					this.filterTable();
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
		let table = this.$$("settings:datatable");
		table.sync(books);
		this.$$("settings:upload").disable();
		this.$$("settings:buttonDelete").disable();
		let multicombo = this.$$("settings:multicombo");
		multicombo.getPopup().getList().sync(table.data);
	}

	filterTable() {
		let id = this.$$("settings:toolbar").getChildViews()[1].getValue();
		this.$$("settings:datatable").filter((obj) => {
			return obj.userId == id;
		}, "", true);
	}

	visibaleViews( value, views){
		if (value){
			views.forEach((item) => {
				item.hide();
			});
		} else {
			views.forEach((item) => {
				item.show();
			});
		}
	}

	addColumn( id, header, content){
		return {id: id, header: [ header, {content: content}], sort: "string"};
	}
}