import { ensureElement } from "../../utils/utils";
import { CardMain, ICardMain } from "./CardMain";

export interface ICardBasket extends ICardMain{
    index: number;
    id: string;
}

export interface ICardBasketActions {
    onDelete?: (data: { id: string }) => void;
}

export class CardBasket extends CardMain {
    protected indexElement: HTMLElement;
    protected deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ICardBasketActions) {
        super(container);

        this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
        this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

        this.deleteButton.addEventListener('click', (ev) => {
            ev.stopPropagation();
            if (actions?.onDelete) {
                const id = this.container.dataset.id;
                if (id) actions.onDelete({ id });
            }
        });
    }

    set index(index: number) {
        this.indexElement.textContent = String(index);
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }
}