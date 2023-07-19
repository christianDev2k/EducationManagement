import Person from './Person.js';

class Student extends Person {
    constructor(id, name, address, email, userType, math, physical, chemistry) {
        super(id, name, address, email, userType);
        this.math = math;
        this.physical = physical;
        this.chemistry = chemistry;
    }

    calcPoints() {
        return (Number(this.math) + Number(this.physical) + Number(this.chemistry) / 3).toLocaleString('vi-VN');
    }
}

export default Student;
