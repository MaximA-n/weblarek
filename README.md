# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
# Интернет-магазин «Web-Larёk»
«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и  отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component
Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`


#### Класс Api
Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter
Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` -  хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

### Данные

#### Интерфейс IProduct

Данный интерфейс отвечает за учёт товаров в приложении.

#### Интерфейс IBuyer

Данный интерфейс отвечает за хранение данных при оформлении заказа.

### Модели данных 

#### Класс Products

Класс отвечает за хранение товаров, которые можно купить в приложении.

Поля класса:

- _items: IProduct[] - хранит массив всех товаров
- _currentProduct: IProduct - хранит товар, выбранный для подробного отображения

Методы класса: 

- setItems(items: IProduct[]) - сохранение массива товаров полученного в параметрах метода
- getItems(): IProduct[] - получение массива товаров из модели
- getProductId(id: string) - получение одного товара по его id
- setProduct(item: IProduct) - сохранение товара для подробного отображения
- getProduct(): IProduct | null - получение товара для подробного отображения

#### Класс Basket

Класс отвечает за хранение товаров, которые пользователь выбрал для покупки.

Поля класса:

- _items: IProduct[] - хранит массив товаров, выбранных покупателем для покупки

Методы класса: 

- getItems(): IProduct[] - получение массива товаров, которые находятся в корзине
- addProduct(item: IProduct) - добавление товара, который был получен в параметре, в массив корзины
- deleteProduct(id: string) - удаление товара, полученного в параметре из массива корзины
- emptyTrash(): void - очистка корзины
- getPriceItems(): number - получение стоимости всех товаров в корзине
- getCountItems(): number - получение количества товаров в корзине
- checkProduct(id: string): boolean - проверка наличия товара в корзине по его id, полученного в параметр метода

#### Класс Buyer

Класс отвечает за данные покупателя, которые тот должен указать при оформлении заказа.

Поля класса:

- _payment: TPayment - вид оплаты
- _address: string - адреc
- _email: string - телефон
- _phone: string - email

Методы класса: 

- setData(data) - сохранение данных в модели
- getData(): IBuyer - получение всех данных покупателя
- clear(): void - очистка данных покупателя
- validateData() - валидация данных

### Слой коммуникации

#### Класс Service

Класс отвечает за выполнение запросов на сервер с помощью метода get класса Api, после чего будет получать с сервера объект с массивом товаров.

Методы класса:

- getApi - получение с сервера объекта с массивом товаров
- postApi - запрос на сервер

### Слой Представления (View)

Слой Представления отвечает за отображение данных.

### Класс Header

Отображает шапку сайта и количество товаров в корзине.

Поля класса:

- counterElement: HTMLElement
- basketButton: HTMLButtonElement

Методы класса:

- set counter(value: number) - обновление счётчика.

Генерируемые события:

- basket:open.

#### Интерфейс IHeader

Поля класса:

- counter: number - количество товаров в корзине.

### Класс Gallery

Показывает массив товаров.

Методы класса:

- set items(items: HTMLElement[]).

#### Интерфейс IGallery

Поля класса:

- items: HTMLElement[] - массив товаров

### Класс Modal

Модальное окно.

Поля класса:

- contentElement: HTMLElement
- closeButton: HTMLButtonElement

Методы класса:

- set content(value: HTMLElement | null)
- open()
- close()

Генерируемые события:

-  modal:close

#### Интерфейс IModal

Поля класса:

- content: HTMLElement | null

### Класс OrderSuccess

Отвечает за отображение успешного оформления заказа.

Поля класса:

- textElement
- closeButton

Методы класса:

- set text(value)
- set total(value) — сумма.

#### Интерфейс IOrderSuccess

Поля класса:

- text: string - описание

### Класс CardMain

Базовый класс карточки товара.

Поля класса:

- titleElement: HTMLElement
- priceElement: HTMLElement

Методы класса:

- set title(value: string) — отображение заголовка.
- set price(value: number | null) — отображение цены или текста "Бесценно".

#### Интерфейс ICardMain

Поля класса:

- title: string — название товара.
- price: number | null

### Класс CardCatalog

Класс отвечает за отображение товара в каталоге.

Поля класса:

- categoryElement: HTMLElement
- imageElement: HTMLImageElement

Методы класса:

- set category(value: string)
- set image(value: string)

#### Интерфейс ICardCatalog

Поля класса:

- id: string
- category: string
- image: string

### Класс CardSelected

Класс отвечает за отображение карточки товара в модальном окне.

Поля класса:

- textElement
- categoryElement
- imageElement
- buttonElement

Методы класса:

- set text(value)
- set category(value)
- set image(path)
- set buttonLabel(value)
- set buttonDisabled(value)
- set price(value)

#### Интерфейс ICardSelected

Поля класса:

- id: string
- text: string — описание товара.
- category: string
- image: string
- buttonLabel: string — подпись кнопки.
- buttonDisabled?: boolean — блокировка кнопки.

### Класс CardBasket

Отображает товар в корзине пользователя.

Поля класса:

- indexElement: HTMLElement
- deleteButton: HTMLButtonElement
- id: string
- index: number

#### Интерфейс ICardBasket

Поля класса:

- index: number — позиция товара в корзине.
- id: string

### Класс BasketWrapper

Отвечает за отображение корзины пользователя.

Поля класса:

- listElement
- totalPriceElement
- basketButton — кнопка оформления заказа.

Методы класса:

- set items(list)
- set total(value)

Генерируемые события:

- basket:order

#### Интерфейс IBasketWrapper

Поля класса:

- items: HTMLElement[] — массив товаров в корзине.
- total: number — итоговая стоимость.

### Класс FormMain

Базовый класс формы.

Поля класса:

- errorsElement
- submitButton
- valid = false;

Методы класса:

- setValid(value)
- setErrors(value)
- updateButtonState()

#### Интерфейс IFormMain

Поля класса:

- valid: boolean
- errors: string

### Класс FormOrder

Форма выбора адреса и способа оплаты.

Поля класса:

- addressElement: HTMLInputElement
- cardButton: HTMLButtonElement
- cashButton: HTMLButtonElement
- payment: TPayment
- address: string

Методы класса:

- updateAddress(value: string)
- updatePayment(value: TPayment)

Генерируемые события:

- payment:changed,
- address:changed,
- paymentForm:submit.

#### Интерфейс IFormOrder

Поля класса:

- address: string
- payment: TPayment

### Класс FormContacts

Форма выбора email и телефона.

Поля класса:

- email: string
- phone: string
- emailElement: HTMLInputElement
- phoneElement: HTMLInputElement

Методы класса:

- setEmail(value)
- setPhone(value)

Генерируемые события:

- contacts:change
- contactsForm:submit.

#### Интерфейс IFormContacts

Поля класса:

- email: string
- phone: string

### Presenter

Презентер отвечает за соединение слоя Представления (View) и модели данных (Models).

Презентер полностью контролирует процесс оформления заказа:
- выбор товара
- просмотр карточки
- добавление в корзину
- оформление
- ввод данных
- отправка заказа
- экран успешного завершения.