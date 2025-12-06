import { ensureElement } from '../../utils/utils';
import { CardMain, ICardMain } from './CardMain';
import { categoryMap } from '../../utils/constants';
import { CDN_URL } from "../../utils/constants";

export interface ICardSelected extends ICardMain {
    id: string;
    text: string;
    category: string;
    image: string;
    buttonLabel: string;
    buttonDisabled?: boolean;
}

export interface ICardSelectedActions {
    onClick?: () => void;
}

export class CardSelected extends CardMain {
    protected textElement: HTMLElement;
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;
    protected buttonElement: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ICardSelectedActions) {
        super(container);

        this.textElement = ensureElement<HTMLElement>('.card__text', container);
        this.categoryElement = ensureElement<HTMLElement>('.card__category', container);
        this.imageElement = ensureElement<HTMLElement>('.card__image', container) as HTMLImageElement;
        this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', container);

        this.buttonElement.addEventListener('click', (ev) => {
            ev.stopPropagation();
            actions?.onClick?.();
        });
    }

    set id(value: string) { this.container.dataset.id = value; }
    set text(value: string) { this.textElement.textContent = value; }

    set category(value: string) {
        this.categoryElement.textContent = value;
        const css = categoryMap[value as keyof typeof categoryMap] ?? categoryMap['другое'];
        this.categoryElement.className = `card__category ${css}`;
    }

    set image(value: string) {
        this.setImage(this.imageElement, `${CDN_URL}/${value}`, this.titleElement.textContent ?? '');
    }

    set buttonLabel(value: string) { this.buttonElement.textContent = value; }
    set buttonDisabled(value: boolean | undefined) { this.buttonElement.disabled = Boolean(value); }

    set price(value: number | null) {
        this.priceElement.textContent = value === null ? 'Бесценно' : `${value} синапсов`;
        if (value === null) {
            this.buttonLabel = 'Недоступно';
            this.buttonDisabled = true;
        }
    }
}