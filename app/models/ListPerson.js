class ListPerson {
    constructor() {
        this.list = [];
    }

    AddUserMethod(newUser) {
        this.list.push(newUser);
    }

    DeleteUserMethod(id) {
        this.list = this.list.filter(u => u.id !== id);
    }
}

export default ListPerson;
