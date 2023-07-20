import Validator from '../../app/util/validations.js';
import Student from '../models/Student.js';
import Employee from '../models/Employee.js';
import Customer from '../models/Customer.js';
import {
    FeatureAccount,
    SearchByName,
    SortAscending,
    SortDescending,
    ActiveButton,
    GetUserByID,
    renderInputOptions,
    ShowInfoMode,
    HandleDeleteUser,
    ShowUserInfo,
    SetDefaultForm,
    HandleAddPerson,
    HandleEditPerson,
    RenderUserList,
} from '../controllers/functions.js';

const event = () => {
    const $ = document.querySelector.bind(document);
    const $$ = document.querySelectorAll.bind(document);

    let editID = -1;
    let curAcc = 'cus';

    // UI: Hide and display sidebar
    $('.navbar__toogle-sidebar').onclick = () => {
        $('.sidebar').classList.toggle('show');
    };

    // UI: Display name button when add person
    const addNewButton = $('#addNewBtn');
    addNewButton.onclick = () => {
        $('#feature').classList.remove('active');
        SetDefaultForm();
        ShowInfoMode(false);
    };

    // UI: Change account
    const accounts = document.getElementsByName('account-options');
    accounts.forEach(acc => {
        acc.onclick = () => {
            curAcc = acc.dataset.account;
            const avatarText = curAcc ? (curAcc === 'stu' ? 'Student' : curAcc === 'emp' ? 'Employee' : 'Customer') : null;
            $('#account-name').innerHTML = avatarText;
        };
    });

    // UI: Clear filters
    $('#clearFilter').onclick = () => {
        RenderUserList();
    };

    // OOP: Validate
    $$('.nav-tabs .nav-link').forEach((b, index) => {
        b.onclick = () => {
            renderInputOptions(index);
            handleValidate(index);
        };
    });

    // OOP: Render input options
    renderInputOptions(0);
    handleValidate(0);

    // OOP: Remove / Edit person
    $('#userData').onclick = e => {
        const button = e.target.parentElement;
        if (button.getAttribute('data-del')) {
            HandleDeleteUser(button.dataset.del);
        } else if (button.getAttribute('data-view')) {
            const id = button.dataset.view;

            ShowInfoMode(true);
            ShowUserInfo(id);
            FeatureAccount(curAcc, id);
        } else if (button.getAttribute('data-edit')) {
            ShowInfoMode(false);
            editID = button.dataset.edit;
            ShowUserInfo(editID);

            getFormBtn.style.display = 'inline-block';
            $('#modal-heading').innerHTML = 'Edit Mode';
            $('#getFormBtn').innerHTML = 'Edit Now!';

            const user = GetUserByID(editID);
            const { userType } = user;
            const index = userType === 'Student' ? 0 : userType === 'Employee' ? 1 : 2;
            ActiveButton(index);
            handleValidate(index);
        }
    };

    // OOP: Sort
    const sortInputs = document.getElementsByName('sort-name');
    sortInputs.forEach(i => {
        i.onchange = () => {
            i.checked ? (i.id === 'price-az' ? SortAscending() : SortDescending()) : null;
        };
    });

    // OOP: Search
    $('#search-btn').onclick = () => {
        SearchByName();
    };

    // =================================================================

    function handleValidate(index) {
        const validator = new Validator('#add-user');
        validator.onSubmit = function (data) {
            const { id, name, address, email, math, physical, chemistry, daysWorked, salary, companyName, invoice, rating } = data;
            let newUser = {};

            switch (index) {
                case 0:
                    newUser = new Student(id, name, address, email, 'Student', math, physical, chemistry);
                    break;
                case 1:
                    newUser = new Employee(id, name, address, email, 'Employee', daysWorked, salary);
                    break;
                case 2:
                    newUser = new Customer(id, name, address, email, 'Customer', companyName, invoice, rating);
                    break;
            }

            editID === -1 ? HandleAddPerson(newUser) : HandleEditPerson(newUser, editID);
        };
    }
};

export default event;
