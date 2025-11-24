import './scss/styles.scss';
import { Products } from "../src/components/Models/Products";
import { apiProducts } from "../src/utils/data";
import { Basket } from "../src/components/Models/Basket";
import { Buyer } from "../src/components/Models/Buyer";
import { API_URL } from "../src/utils/constants";
import { Api } from './components/base/Api';
import { Service } from './components/Models/Communication';


const productsModel = new Products();

productsModel.setItems(apiProducts.items);
console.log('Массив товаров из каталога:', productsModel.getItems());

console.log('ID:', productsModel.getProductId(apiProducts.items[0].id));
productsModel.setProduct(apiProducts.items[0]);
console.log('Товар из каталога:', productsModel.getProduct());

const basketModels = new Basket();

basketModels.addProduct(apiProducts.items[0]);

console.log('Корзина:', basketModels.getItems());
console.log('Цена:', basketModels.getPriceItems());
console.log('Кол-во:', basketModels.getCountItems());

console.log('Проверка наличия:', basketModels.checkProduct(apiProducts.items[0].id));
console.log('Удаление:', basketModels.deleteProduct(apiProducts.items[0].id));

basketModels.addProduct(apiProducts.items[0]);

console.log('Добавление:', basketModels.getItems());
console.log('Очистка:', basketModels.emptyTrash());

const buyerModels = new Buyer();

buyerModels.setData({
    payment: 'card',
    email: 'ivanov@mail.ru',
    address: 'SPb',
});

console.log('Buyer:', buyerModels.getData());
console.log('Validate:', buyerModels.validateData());
console.log('очистка:', buyerModels.clear());

const apiModels = new Api(API_URL);
const serviceModels = new Service(apiModels);

serviceModels.getApi()
    .then((items) => {
        productsModel.setItems(items);
        console.log('Товары с сервера:', productsModel.getItems());
    });