import './scss/styles.scss';

import { EventEmitter } from "./components/base/Events";
import { Api } from './components/base/Api';
import { Service } from './components/Models/Communication';

import { Products } from "./components/Models/Products";
import { Basket } from "./components/Models/Basket";
import { Buyer } from "./components/Models/Buyer";

import { API_URL } from "./utils/constants";
import { cloneTemplate, ensureElement } from './utils/utils';

import { BasketWrapper } from './components/View/BasketWrapper';
import { CardBasket } from './components/View/CardBasket';
import { CardCatalog } from './components/View/CardCatalog';
import { CardSelected } from './components/View/CardSelected';

import { FormContacts } from './components/View/FormContacts';
import { FormOrder } from './components/View/FormOrder';

import { Gallery } from './components/View/Gallery';
import { Header } from './components/View/Header';
import { Modal } from './components/View/Modal';
import { OrderSuccess } from './components/View/OrderSuccess';

import { IProduct, IOrder, TPayment, IBuyer } from "./types";

const events = new EventEmitter();

const productsModel = new Products(events);
const basketModel = new Basket(events);
const buyerModel = new Buyer(events);

const api = new Api(API_URL);
const serviceModel = new Service(api);

const header = new Header(events, ensureElement<HTMLElement>('.header'));
const gallery = new Gallery(ensureElement<HTMLElement>('.gallery'));
const modal = new Modal(events, ensureElement<HTMLElement>('#modal-container'));

const tplCardCatalog = ensureElement<HTMLTemplateElement>('#card-catalog');
const tplCardPreview = ensureElement<HTMLTemplateElement>('#card-preview');
const tplCardBasket = ensureElement<HTMLTemplateElement>('#card-basket');

const tplOrder = ensureElement<HTMLTemplateElement>('#order');
const tplContacts = ensureElement<HTMLTemplateElement>('#contacts');
const tplSuccess = ensureElement<HTMLTemplateElement>('#success');
const tplBasket = ensureElement<HTMLTemplateElement>('#basket');

const formContacts = new FormContacts(cloneTemplate(tplContacts), events);
const formOrder = new FormOrder(cloneTemplate(tplOrder), events);
const success = new OrderSuccess(cloneTemplate(tplSuccess), () => modal.close());
const basketWrapper = new BasketWrapper(cloneTemplate(tplBasket), events);

serviceModel.getApi()
    .then(response => productsModel.setItems(response.items))
    .catch(err => console.error('Ошибка загрузки товаров', err));

events.on('products:loaded', () => {
    const cards = productsModel.getItems().map(item => {
        const card = new CardCatalog(cloneTemplate(tplCardCatalog), {
            onClick: () => events.emit('card:select', item)
        });
        return card.render(item);
    });
    gallery.render({ items: cards });
});

events.on('card:select', (data: { id: string }) => {
    const product = productsModel.getProductId(data.id);
    if (product) productsModel.setProduct(product);
});

events.on('products:select', (product: IProduct) => {
    const inBasket = basketModel.checkProduct(product.id);

    const card = new CardSelected(cloneTemplate(tplCardPreview), {
        onClick: () => events.emit("product:toggle", { id: product.id })
    });

    const cardData = {
        ...product,
        buttonLabel: product.price === null
            ? 'Недоступно'
            : inBasket
                ? 'Удалить из корзины'
                : 'В корзину',
        buttonDisabled: product.price === null
    };

    modal.render({ content: card.render(cardData) });
    modal.open();
});

events.on("product:toggle", ({ id }: { id: string }) => {
    const product = productsModel.getProductId(id);
    if (!product || product.price === null) return;

    const inBasket = basketModel.checkProduct(id);

    if (inBasket) {
        basketModel.deleteProduct(id);
    } else {
        basketModel.addProduct(product);
    }

    modal.close();
});

events.on('basket:add', (product: IProduct) => {
    basketModel.addProduct(product);
    modal.close();
});

events.on('basket:remove', (data: { id: string }) => basketModel.deleteProduct(data.id));

events.on('basket:change', () => {
    const items = basketModel.getItems();
    const cards = items.map((item, index) => {
        const card = new CardBasket(cloneTemplate(tplCardBasket), {
            onDelete: (data) => events.emit('basket:remove', data)
        });
        card.id = item.id;
        card.index = index + 1;
        return card.render({ title: item.title, price: item.price });
    });

    basketWrapper.render({ items: cards, total: basketModel.getPriceItems() });
    header.counter = basketModel.getCountItems();
});

events.on('basket:open', () => {
    modal.render({ content: basketWrapper.render() });
    modal.open();
});

events.on('basket:order', () => {
    const data = buyerModel.getData();
    formOrder.updateAddress(data.address);
    formOrder.updatePayment(data.payment);
    modal.render({ content: formOrder.render() });
    modal.open();
});

events.on('payment:changed', (data: { payment: TPayment }) => {
    buyerModel.setData({ payment: data.payment });

    const v = buyerModel.validateData();
    const isValid = !v.address && !v.payment;

    formOrder.setErrors([v.address, v.payment].filter(Boolean).join(', '));
    formOrder.setValid(isValid);
});

events.on('address:changed', (data: { address: string }) => {
    buyerModel.setData({ address: data.address });

    const v = buyerModel.validateData();
    const isValid = !v.address && !v.payment;

    formOrder.setErrors([v.address, v.payment].filter(Boolean).join(', '));
    formOrder.setValid(isValid);
});

events.on<{ field: keyof IBuyer; value: string }>(
    'contacts:change',
    ({ field, value }) => {
        buyerModel.setData({ [field]: value });

        const v = buyerModel.validateData();
        const isValid = !v.email && !v.phone;

        formContacts.setErrors([v.email, v.phone].filter(Boolean).join(', '));
        formContacts.setValid(isValid);
    }
);

events.on('paymentForm:submit', () => {
    const v = buyerModel.validateData();

    if (v.address || v.payment) {
        formOrder.setErrors([v.address, v.payment].filter(Boolean).join(', '));
        return;
    }

    modal.render({ content: formContacts.render() });
    modal.open();
});

events.on('contactsForm:submit', () => {
    const order: IOrder = {
        ...buyerModel.getData(),
        items: basketModel.getItems().map(i => i.id),
        total: basketModel.getPriceItems()
    };

    serviceModel.postApi(order)
        .then(res => {
            success.total = res.total;
            modal.render({ content: success.render() });
            modal.open();
            basketModel.emptyTrash();
            buyerModel.clear();
        })
        .catch(() => {
            formContacts.setErrors('Ошибка оформления заказа');
        });
});

events.on('success:close', () => modal.close());
events.on('modal:close', () => modal.close());