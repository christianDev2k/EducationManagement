import Person from './Person.js';

class Customer extends Person {
    constructor(id, name, address, email,userType, companyName, invoiceValue, rating) {
        super(id, name, address, email, userType);
        this.nameCompany = companyName;
        this.billValue = invoiceValue;
        this.rating = rating;
    }
}

export default Customer;