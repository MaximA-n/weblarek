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

import { IProduct, IOrder, TPayment } from "./types";

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
        onClick: () => {
            if (product.price === null) return;

            const nowInBasket = basketModel.checkProduct(product.id);
            if (nowInBasket) {
                basketModel.deleteProduct(product.id);
            } else {
                basketModel.addProduct(product);
            }
            events.emit('basket:change');
            modal.close();
        }
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

let basketWrapper: BasketWrapper;

events.on('basket:add', (product: IProduct) => {
    basketModel.addProduct(product);
    modal.close();
    events.emit('basket:change');
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

    if (basketWrapper) {
        basketWrapper.render({ items: cards, total: basketModel.getPriceItems() });
    }
    header.counter = basketModel.getCountItems();
});

events.on('basket:open', () => {
    const basketEl = cloneTemplate(tplBasket);
    basketWrapper = new BasketWrapper(basketEl, events);
    modal.render({ content: basketEl });
    events.emit('basket:change');
    modal.open();
});

events.on('basket:order', () => {
    const form = new FormOrder(cloneTemplate(tplOrder), events);
    const data = buyerModel.getData();
    form.updateAddress(data.address);
    form.updatePayment(data.payment);
    modal.render({ content: form.render() });
    modal.open();
});

events.on('paymentForm:submit', () => {
    const v = buyerModel.validateData();
    if (v.payment && v.address) {
        const form = new FormContacts(cloneTemplate(tplContacts), events);
        modal.render({ content: form.render() });
        modal.open();
    } else {
        const form = new FormOrder(cloneTemplate(tplOrder), events);
        form.errors = 'Заполните все поля корректно';
        modal.render({ content: form.render() });
        modal.open();
    }
});

events.on('contactsForm:submit', () => {
    const validation = buyerModel.validateData();
    const emailError = validation.email;
    const phoneError = validation.phone;

    if (!emailError && !phoneError) {
        const orderData: IOrder = {
            payment: buyerModel.getData().payment as TPayment,
            email: buyerModel.getData().email,
            phone: buyerModel.getData().phone,
            address: buyerModel.getData().address,
            items: basketModel.getItems().map(i => i.id),
            total: basketModel.getPriceItems()
        };

        serviceModel.postApi(orderData)
            .then(res => {
                const success = new OrderSuccess(cloneTemplate(tplSuccess), () => modal.close());
                success.total = res.total;

                modal.render({ content: success.render() });
                modal.open();

                basketModel.emptyTrash();
                buyerModel.clear();
            })
            .catch(err => {
                console.error('Ошибка при создании заказа:', err);

                const form = new FormContacts(cloneTemplate(tplContacts), events);
                form.errors = 'Ошибка при оформлении заказа. Попробуйте еще раз.';
                modal.render({ content: form.render() });
                modal.open();
            });
    } else {
        const form = new FormContacts(cloneTemplate(tplContacts), events);
        form.errors = 'Заполните телефон и email корректно';
        modal.render({ content: form.render() });
        modal.open();
    }
});

events.on('success:close', () => modal.close());
events.on('modal:close', () => modal.close());