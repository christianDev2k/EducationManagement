import Person from './Person.js';

class Student extends Person {
    constructor(id, name, address, email, math, physical, chemistry) {
        super(id, name, address, email);
        this.math = math;
        this.physical = physical;
        this.chemistry = chemistry;
    }
}

export default Student;



