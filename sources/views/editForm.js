import { JetView } from "webix-jet";
import { users } from "models/users";

export default class EditFormView extends JetView {
	config() {

		let editForm = {
			view: "form",
			id: "users:editForm",
			elementsConfig: {
				labelWidth: 100
			},
			elements: [{
				rows: [
					this.addLabel( "firstName", "User Name"),
					this.addLabel( "lastName", "Title"),
					this.addLabel( "email", "Email"),
					{
						cols: [
							{},
							{
								view: "button", label: "Save", type: "form",
								click: () => {
									let form = this.getRoot().getBody();
									let values = form.getValues();
									if (form.validate()) {
										users.updateItem(values.id, values);
									}
									this.hideForm(form);
								}
							},
							{
								view: "button", label: "Cancel",
								click: () => {
									this.hideForm();
								},
							}
						]
					}
				]
			}],
			rules: {
				firstName: webix.rules.isNotEmpty,
				lastName: webix.rules.isNotEmpty,
				email: webix.rules.isNotEmpty
			}
		};

		let popup = {
			view: "window",
			id: "editForm:popup",
			height: 500,
			width: 500,
			position: "center",
			move: true,
			head: { template: "Edit user" },
			body: editForm
		};

		return popup;
	}

	showWindow(data) {
		let win = this.$$("editForm:popup");
		win.show();
		win.getBody().setValues(data);
	}

	hideForm() {
		let win = this.$$("users:editForm");
		win.hide();
		win.clear();
		win.clearValidation();
	}

	addLabel( name, label){
		return { view: "text", name: name, label: label, labelAlign: "right"};
	}
}