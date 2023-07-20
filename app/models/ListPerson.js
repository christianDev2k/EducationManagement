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

    EditUserMethod(newUser, id) {
        const index = this.list.findIndex(u => u.id === id);
        this.list[index] = newUser;
    }

    SortbyName(options) {
        const [...sortArray] = this.list;
        return options === 'acc' ? sortArray.sort((a, b) => a.name.localeCompare(b.name)) : sortArray.sort((a, b) => b.name.localeCompare(a.name));
    }
}

export default ListPerson;
