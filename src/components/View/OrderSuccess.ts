import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

interface IOrderSuccess { text: string; }

export class OrderSuccess extends Component<IOrderSuccess> {
    protected textElement: HTMLElement;
    protected closeButton: HTMLButtonElement;

    constructor(container: HTMLElement, onClose?: () => void) {
        super(container);

        this.textElement = ensureElement<HTMLElement>('.order-success__description', this.container);
        this.closeButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container);

        if (onClose) this.closeButton.addEventListener('click', () => onClose());
    }

    set text(value: string) { this.textElement.textContent = value; }

    set total(value: number) {
        this.text = `Заказ успешно оформлен! Общая сумма: ${value} синапсов.`;
    }
}