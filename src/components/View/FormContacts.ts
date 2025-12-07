import { ensureElement } from "../../utils/utils";
import { FormMain, IFormMain } from "./FormMain";
import { IEvents } from "../base/Events";

export interface IFormContacts extends IFormMain {
    email: string;
    phone: string;
}

export class FormContacts extends FormMain {
    protected emailElement: HTMLInputElement;
    protected phoneElement: HTMLInputElement;

    email: string = '';
    phone: string = '';
    
    constructor(container: HTMLElement, protected events: IEvents) {
        super(container, events);

        this.emailElement = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
        this.phoneElement = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);

        this.emailElement.addEventListener("input", () => {
            this.email = this.emailElement.value;
            this.events.emit("contacts:change", { field: "email", value: this.email });
        });

        this.phoneElement.addEventListener("input", () => {
            this.phone = this.phoneElement.value;
            this.events.emit("contacts:change", { field: "phone", value: this.phone });
        });

        this.submitButton.addEventListener('click', (evt) => {
            evt.preventDefault();
            this.events.emit('contactsForm:submit');
        });
    }

    setEmail(value: string) {
        this.email = value;
        this.emailElement.value = value;
    }

    setPhone(value: string) {
        this.phone = value;
        this.phoneElement.value = value;
    }
}