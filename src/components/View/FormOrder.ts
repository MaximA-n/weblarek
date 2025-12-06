import { ensureElement } from "../../utils/utils";
import { FormMain, IFormMain } from "./FormMain";
import { TPayment } from "../../types";
import { IEvents } from "../base/Events";

export interface IFormOrder extends IFormMain {
    address: string;
    payment: TPayment;
}

export class FormOrder extends FormMain implements IFormOrder {
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
            this.updatePayment('card');
            this.events.emit('payment:changed', { payment: this.payment });
            this.updateValidity();
        });

        this.cashButton.addEventListener('click', () => {
            this.updatePayment('cash');
            this.events.emit('payment:changed', { payment: this.payment });
            this.updateValidity();
        });

        this.addressElement.addEventListener('input', () => {
            this.updateAddress(this.addressElement.value);
            this.events.emit('address:changed', { address: this.address });
            this.updateValidity();
        });

        this.submitButton.addEventListener('click', (evt) => {
            evt.preventDefault();
            this.events.emit('paymentForm:submit');
        });

        this.updateValidity();
    }

    updateAddress(value: string) {
        this.address = value;
        this.addressElement.value = value;
    }

    updatePayment(value: TPayment) {
        this.payment = value;

        this.cardButton.classList.toggle('active', value === 'card');
        this.cashButton.classList.toggle('active', value === 'cash');
    }

    protected updateValidity() {
        const addressValid = this.address.trim() !== '';
        const paymentValid = this.payment === 'card' || this.payment === 'cash';

        this.valid = addressValid && paymentValid;

        if (!addressValid) this.errors = 'Введите адрес доставки';
        else if (!paymentValid) this.errors = 'Выберите способ оплаты';
        else this.errors = '';
    }
}