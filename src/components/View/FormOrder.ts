import { ensureElement } from "../../utils/utils";
import { FormMain, IFormMain } from "./FormMain";
import { TPayment } from "../../types";
import { IEvents } from "../base/Events";

export interface IFormOrder extends IFormMain {
    address: string;
    payment: TPayment;
}

export class FormOrder extends FormMain {
    protected addressElement: HTMLInputElement;
    protected cardButton: HTMLButtonElement;
    protected cashButton: HTMLButtonElement;

    payment: TPayment = '';
    address: string = '';

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container, events);

        this.addressElement = ensureElement<HTMLInputElement>('input[name="address"]', this.container);
        this.cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
        this.cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);

        this.cardButton.addEventListener('click', () => {
            this.events.emit('payment:changed', { payment: 'card' });
        });

        this.cashButton.addEventListener('click', () => {
            this.events.emit('payment:changed', { payment: 'cash' });
        });

        this.addressElement.addEventListener('input', () => {
            this.events.emit('address:changed', { address: this.addressElement.value });
        });

        this.submitButton.addEventListener('click', (evt) => {
            evt.preventDefault();
            this.events.emit('paymentForm:submit');
        });
    }

    updateAddress(value: string) {
        this.address = value;
        this.addressElement.value = value;
    }

    updatePayment(value: TPayment) {
        this.payment = value;
        this.cardButton.classList.toggle('button_alt-active', value === 'card');
        this.cashButton.classList.toggle('button_alt-active', value === 'cash');
    }
}