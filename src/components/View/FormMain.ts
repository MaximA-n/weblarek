import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export interface IFormMain {
    valid: boolean;
    errors: string;
}

export class FormMain extends Component<IFormMain> {
    protected errorsElement: HTMLElement;
    protected submitButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this.errorsElement = ensureElement<HTMLElement>('.form__errors', this.container);
        this.submitButton = ensureElement<HTMLButtonElement>('.button[type="submit"]', this.container);
    }

    set valid(value: boolean) {
        this.submitButton.disabled = !value;
    }

    set errors(value: string) {
        this.errorsElement.textContent = value;
    }
}