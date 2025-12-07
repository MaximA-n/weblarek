import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IBasketWrapper {
    items: HTMLElement[];
    total: number;
}

export class BasketWrapper extends Component<IBasketWrapper> {
    protected listElement: HTMLElement;
    protected totalPriceElement: HTMLElement;
    protected basketButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this.listElement = ensureElement<HTMLElement>('.basket__list', this.container);
        this.totalPriceElement = ensureElement<HTMLElement>('.basket__price', this.container);
        this.basketButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);

        this.basketButton.addEventListener('click', () => {
            this.events.emit('basket:order');
        });
    }

    set items(list: HTMLElement[]) {
        if (list.length === 0) {
            this.basketButton.disabled = true;
            this.basketButton.classList.add('button_disabled');

            const empty = document.createElement('p');
            empty.classList.add('basket__empty');
            empty.textContent = 'Корзина пуста';

            this.listElement.replaceChildren(empty);
            return;
        }

        this.basketButton.disabled = false;
        this.basketButton.classList.remove('button_disabled');

        this.listElement.replaceChildren(...list);
    }

    set total(value: number) {
        this.totalPriceElement.textContent = `${value} синапсов`;
    }
}
