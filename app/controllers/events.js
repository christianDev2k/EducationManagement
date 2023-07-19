import Validator from '../../app/util/validations.js';
import { HandleAddPerson, AnableInput, HandleDeleteUser } from '../controllers/functions.js';

const event = () => {
    const $ = document.querySelector.bind(document);
    const $$ = document.querySelectorAll.bind(document);

    // Validate
    Validator('#add-user');

    // UI: Hide and display sidebar
    $('.navbar__toogle-sidebar').onclick = () => {
        $('.sidebar').classList.toggle('show');
    };

    // UI: Display name button when add person
    const addNewButton = $('#addNewBtn');
    addNewButton.onclick = () => {
        let id = 0;
        do {
            id = new Date().getTime().toString() % 1000000;
        } while (id < 100000 && id > 999999);

        $('#id').value = id;
        getFormBtn.innerHTML = 'Add Now!';
    };

    // UI: Anabled input field
    let typeUser = AnableInput();
    const navTabBtn = $$('.nav-tabs .nav-link');
    navTabBtn.forEach(b => {
        b.onclick = e => {
            typeUser = AnableInput(e);
        };
    });

    // OOP: Add person
    const getFormBtn = $('#getFormBtn');
    getFormBtn.onclick = () => {
        HandleAddPerson(typeUser);
    };

    // OOP: Remove / Edit person
    $('#userData').onclick = e => {
        if (e.target.parentElement.getAttribute('data-del')) {
            HandleDeleteUser(e.target.parentElement.dataset.del);
        }

        if (e.target.parentElement.getAttribute('data-edit')) {
            addNewButton.click();
            $('#getFormBtn').innerHTML = 'Edit Now!';

            // editID = e.target.parentElement.dataset.edit;
            // f.getEditProduct(editID);
        }
    };
};

export default event;
