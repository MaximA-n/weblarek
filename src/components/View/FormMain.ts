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
    protected valid = false;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this.errorsElement = ensureElement<HTMLElement>('.form__errors', this.container);
        this.submitButton = ensureElement<HTMLButtonElement>('.button[type="submit"]', this.container);
    }

    setValid(value: boolean) {
        this.valid = value;
        this.updateButtonState();
    }

    setErrors(value: string = '') {
        this.errorsElement.textContent = value;
    }

    protected updateButtonState() {
        this.submitButton.disabled = !this.valid;
    }
}