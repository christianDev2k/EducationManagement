import Person from './Person.js';

class Employee extends Person {
    constructor(id, name, address, email, userType, days, salary) {
        super(id, name, address, email, userType);
        this.days = days;
        this.salary = salary;
    }

    calcSalary() {
        return (this.salary * this.days).toLocaleString('vi-VN');
    }
}

export default Employee;
