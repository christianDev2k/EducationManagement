import Student from '../models/Student.js';
import Employee from '../models/Employee.js';
import Customer from '../models/Customer.js';
import ListPerson from '../models/ListPerson.js';

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const KEY_STORAGE = 'userList';

const listPerson = new ListPerson();

// Local Storage: Set local
function SetLocalStorages(value) {
    localStorage.setItem(KEY_STORAGE, JSON.stringify(value));
}

// Local Storage: Get Local
export function GetLocalStorages() {
    const data = localStorage.getItem(KEY_STORAGE) ? JSON.parse(localStorage.getItem(KEY_STORAGE)) : [];
    listPerson.list = data.map(p => {
        const { id, name, email, address, math, physical, chemistry, days, salary, nameCompany, billValue, rating } = p;
        switch (p.userType) {
            case 'Student':
                return new Student(id, name, address, email, 'Student', math, physical, chemistry);
            case 'Employee':
                return new Employee(id, name, address, email, 'Employee', days, salary);
            case 'Customer':
                return new Customer(id, name, address, email, 'Customer', nameCompany, billValue, rating);
        }
    });
    RenderUserList(listPerson.list);
}

// Common
export function GetUserByID(id) {
    const userArray = listPerson.list.filter(p => p.id === id);
    const [user] = userArray;
    return user;
}

// UI: Render input options
export function renderInputOptions(index) {
    ActiveButton(index);
    const element = $('#input-options');
    let html = '';
    switch (index) {
        case 0:
            html = `
                <div class="row">
                    <div class="col-4 form-group mb-2">
                        <label for="math" class="form-label">Math</label>
                        <input type="number" name="math" id="math" class="form-control" rules="required" aria-describedby="helpId" />
                        <small class="form-message"></small>
                    </div>
                    <div class="col-4 form-group mb-2">
                        <label for="physical" class="form-label">Physical</label>
                        <input type="number" name="physical" id="physical" class="form-control" rules="required" aria-describedby="helpId" />
                        <small class="form-message"></small>
                    </div>
                    <div class="col-4 form-group mb-2">
                        <label for="chemistry" class="form-label">Chemistry</label>
                        <input type="number" name="chemistry" id="chemistry" class="form-control" rules="required" aria-describedby="helpId" />
                        <small class="form-message"></small>
                    </div>

                </div>`;
            break;
        case 1:
            html = `
                <div class='row'>
                    <div class='col-6 form-group mb-2'>
                        <label for='daysWorked' class='form-label'>
                            Days of worked
                        </label>
                        <input type='number' name='daysWorked' id='daysWorked' class='form-control' rules='required' aria-describedby='helpId' />
                        <small class='form-message'></small>
                    </div>
                    <div class='col-6 form-group mb-2'>
                        <label for='salary' class='form-label'>
                            Daily Salary (VND)
                        </label>
                        <input type='number' name='salary' id='salary' class='form-control' rules='required' aria-describedby='helpId' />
                        <small class='form-message'></small>
                    </div>
                </div>`;
            break;
        case 2:
            html = `
                <div class="row">
                    <div class="col-4 form-group mb-2">
                        <label for="companyName" class="form-label">Company Name</label>
                        <input type="text" name="companyName" id="companyName" class="form-control" rules="required" aria-describedby="helpId" />
                        <small class="form-message"></small>
                    </div>
                    <div class="col-4 form-group mb-2">
                        <label for="invoice" class="form-label">Invoice Value (VND)</label>
                        <input type="number" name="invoice" id="invoice" class="form-control" rules="required" aria-describedby="helpId" />
                        <small class="form-message"></small>
                    </div>
                    <div class="col-4 form-group mb-2">
                        <label for="rating" class="form-label">Rating</label>
                        <input type="text" name="rating" id="rating" class="form-control" rules="required" aria-describedby="helpId" />
                        <small class="form-message"></small>
                    </div>
                </div>
            `;
            break;
    }
    element.innerHTML = html;
}

// UI: Render user list
export function RenderUserList(arr = listPerson.list) {
    let html = arr.map(p => {
        const { id, name, email, userType } = p;
        return `
                <tr>
                    <th>${id}</th>
                    <th>${userType}</th>
                    <th>${name}</th>
                    <th>${email}</th>
                    <th class="action-icon text-end">
                        <button data-view=${id} class="border-0 bg-transparent" data-bs-toggle="modal" data-bs-target="#addProductModal">
                            <i class="fa-regular fa-eye"></i>
                        </button>
                        <button data-edit="${id}" class="border-0 bg-transparent" data-bs-toggle="modal" data-bs-target="#addProductModal">
                            <i class="fa-regular fa-pen-to-square"></i>
                        </button>
                        <button data-del="${id}" class="border-0 bg-transparent">
                            <i class="fa-regular fa-trash-can"></i>
                        </button>
                    </th>
                </tr>
                `;
    });
    $('#userData').innerHTML = html.join('');
}

// UI: Remove invalid
function RemoveInvalid() {
    const formValids = $$('.form-group.invalid');
    if (formValids.length) {
        formValids.forEach(f => {
            f.classList.remove('invalid');
            f.querySelector('.form-message').innerHTML = '';
        });
    }
}

// UI: Set default form
export function SetDefaultForm() {
    $('#add-user').reset();
    RemoveInvalid();
    renderInputOptions(0);

    // Generate user ID
    let id = 0;
    do {
        id = new Date().getTime().toString() % 1000000;
    } while (Number(id) < 100000 && Number(id) > 999999);

    $('#id').value = id;
    $('#modal-heading').innerHTML = 'Add User';
    getFormBtn.style.display = 'inline-block';
    getFormBtn.innerHTML = 'Add Now!';
}

// UI: Show information user
export function ShowUserInfo(id) {
    const user = GetUserByID(id);
    const { name, email, address, userType, math, physical, chemistry, days, salary, nameCompany, billValue, rating } = user;
    $('#modal-heading').innerHTML = 'User Information';
    $('#id').value = id;
    $('#name').value = name;
    $('#email').value = email;
    $('#address').value = address;

    switch (userType) {
        case 'Student':
            renderInputOptions(0);

            $('#math').value = math;
            $('#physical').value = physical;
            $('#chemistry').value = chemistry;
            break;
        case 'Employee':
            renderInputOptions(1);

            $('#daysWorked').value = days;
            $('#salary').value = salary;
            break;
        case 'Customer':
            renderInputOptions(2);

            $('#companyName').value = nameCompany;
            $('#invoice').value = billValue;
            $('#rating').value = rating;
            break;
    }
}

// UI: Show infor mode
export function ShowInfoMode(status) {
    const inputs = $$('#add-user .form-control, #add-user .nav-link');
    if (status) {
        $('.nav-tabs').style.display = 'none';
        $('#getFormBtn').style.display = 'none';
        inputs.forEach(i => {
            i.disabled = true;
        });
    } else {
        $('.nav-tabs').style.display = 'flex';
        $('#getFormBtn').style.display = 'inline-block';
        inputs.forEach(i => {
            i.disabled = false;
        });
    }

    RemoveInvalid();
}

// UI: Active button type options
export function ActiveButton(index) {
    const button = $$('#add-user .nav-link');
    $('#add-user .nav-link.active').classList.remove('active');
    button[index].classList.add('active');
}

// UI: User Account
export function FeatureAccount(curAcc, id) {
    const fea = $('#feature');
    const title = $('#feature .title');
    const result = $('#feature .result');
    const index = listPerson.list.findIndex(p => p.id === id);

    const user = listPerson.list[index];

    if (curAcc === 'stu' && user.userType === 'Student') {
        fea.classList.add('active');
        title.innerHTML = 'Average of subject: ';
        result.innerHTML = user.calcPoints() + ' points';
    } else if (curAcc === 'emp' && user.userType === 'Employee') {
        fea.classList.add('active');
        title.innerHTML = 'Salary of employee: ';
        result.innerHTML = user.calcSalary() + ' VND';
    } else {
        fea.classList.remove('active');
    }
}

// OOP: Add user
export function HandleAddPerson(newUser) {
    listPerson.AddUserMethod(newUser);
    SetLocalStorages(listPerson.list);

    RenderUserList();
    showNotice('Added successful!');
    $('#closeAddPerson').click();
}

// OOP: Delete user
export function HandleDeleteUser(id) {
    listPerson.DeleteUserMethod(id);

    SetLocalStorages(listPerson.list);
    RenderUserList();
    showNotice('Delete successful!', 'delete');
}

// OOP: Edit user
export function HandleEditPerson(newUser, editID) {
    listPerson.EditUserMethod(newUser, editID);
    SetLocalStorages(listPerson.list);

    RenderUserList();
    $('#closeAddPerson').click();
}

// sortAscending
export function SortAscending() {
    const list = listPerson.SortbyName('acc');
    RenderUserList(list);
}

// // sortDescending
export function SortDescending() {
    const list = listPerson.SortbyName('des');
    RenderUserList(list);
}

// Seach by Name
export function SearchByName() {
    // Chuyển value về dạng: xóa khoảng trắng, chữ thường, không dấu.
    const keyInput = $('#searchNameInput').value.trim().toLowerCase();
    const inputName = keyInput.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    const filteredData = listPerson.list.filter(p => {
        const nameLowerCase = p.userType.toLowerCase();
        const dataName = nameLowerCase.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

        return dataName.includes(inputName);
    });

    if (filteredData.length && keyInput.length) {
        RenderUserList(filteredData);
    } else {
        RenderUserList([]);
        showNotice('No results found!', 'no result');
    }
}

// Show status notice
export function showNotice(message, status = 'success') {
    setTimeout(() => {
        const noticeElement = document.querySelector('.notice-status');
        noticeElement.classList.add('show');
        noticeElement.innerHTML = message;
        noticeElement.style.backgroundColor = status === 'success' ? 'rgba(130, 49, 211, 0.8)' : 'rgba(255, 15, 15, 0.8)';

        setTimeout(() => {
            noticeElement.classList.remove('show');
        }, 2000);
    }, 500);
}
