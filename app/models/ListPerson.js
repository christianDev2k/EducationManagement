class ListPerson {
    constructor() {
        this.studentList = [];
        this.employeeList = [];
        this.customersList = [];
    }
    AddPersonMethod(userList, user) {
        userList.push(user);
    }
}

export default ListPerson;