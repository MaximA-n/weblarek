import { IBuyer } from "../../types";
import { TPayment } from "../../types";
import { IValidate } from "../../types";

export class Buyer {
    protected _payment: TPayment = '';
    protected _address: string = '';
    protected _email: string = '';
    protected _phone: string = '';

    setData(data: Partial<IBuyer>) {
        if (data.payment !== undefined) {
            this._payment = data.payment;
        }

        if (data.address !== undefined) {
            this._address = data.address;
        }
        
        if (data.email !== undefined) {
            this._email = data.email;
        }
        
        if (data.phone !== undefined) {
            this._phone = data.phone;
        }        
    }

    getData(): IBuyer {
        return {
            payment: this._payment,
            email: this._email,
            phone: this._phone,
            address: this._address,        
        }
    }

    clear() {
        this._payment = '';
        this._email = '';
        this._phone = '';
        this._address = '';
    }

    validateData(): IValidate {
        let message: IValidate = {};
        
        if (!this._payment) {
            message.payment = 'Не выбран вид оплаты';
        }

        if (!this._address) {
            message.address = 'Не указан адрес';
        }
        
        if (!this._email) {
            message.email = 'Укажите емэйл';
        }

        if (!this._phone) {
            message.phone = 'Не указан телефон';
        }

        return message;
    }
}