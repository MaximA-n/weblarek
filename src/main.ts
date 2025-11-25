import './scss/styles.scss';
import { Products } from "./components/Models/Products";
import { apiProducts } from "./utils/data";
import { Basket } from "./components/Models/Basket";
import { Buyer } from "./components/Models/Buyer";
import { API_URL } from "./utils/constants";
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

const id =apiProducts.items[0].id
console.log('Проверка наличия до удаления:', basketModels.checkProduct(id));
basketModels.deleteProduct(id);
console.log('Проверка наличия после удаления:', basketModels.checkProduct(id));

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
console.log('Очистка:', buyerModels.clear());

const apiModels = new Api(API_URL);
const serviceModels = new Service(apiModels);

serviceModels.getApi()
    .then((response) => {
        productsModel.setItems(response.items);
        console.log('Товары с сервера:', productsModel.getItems());
    });