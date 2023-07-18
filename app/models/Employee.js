import Person from './Person.js';

class Employee extends Person {
    constructor(id, name, address, email, days, salary) {
        super(id, name, address, email);
        this.days = days; 
        this.salary = salary;
    }
}

export default Employee;