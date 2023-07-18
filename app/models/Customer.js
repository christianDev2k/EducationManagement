import Person from './Person.js';

class Customer extends Person {
    constructor(id, name, address, email, companyName, invoiceValue, rating) {
        super(id, name, address, email);
        this.nameCompany = companyName;
        this.billValue = invoiceValue;
        this.rating = rating;
    }
}

export default Customer;