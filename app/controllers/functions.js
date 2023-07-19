import Validator from '../../app/util/validations.js';
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
        switch (p.userType) {
            case 'Student':
                return new Student(p.id, p.name, p.address, p.email, 'Student', p.math, p.physical, p.chemistry);
            case 'Employee':
                return new Employee(p.id, p.name, p.address, p.email, 'Employee', p.daysWorked, p.salary);
            case 'Customer':
                return new Customer(p.id, p.name, p.address, p.email, 'Customer', p.companyName, p.invoice, p.rating);
        }
    });

    RenderUserList(listPerson.list);
}

// UI: Check and anable input field
export function AnableInput(e) {
    const tabPane = $$('.tab-pane');
    tabPane.forEach(t => {
        if (t.classList.contains('active')) {
            const inputs = t.querySelectorAll('.form-control');
            inputs.forEach(i => {
                i.disabled = false;
            });
        } else {
            const inputs = t.querySelectorAll('.form-control');
            inputs.forEach(i => {
                i.disabled = true;
            });
        }
    });

    return e ? e.target.closest('.nav-link').dataset.user : 'student';
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
                        <button class="border-0 bg-transparent">
                            <i class="fa-regular fa-eye"></i>
                        </button>
                        <button data-edit="${id}" class="border-0 bg-transparent">
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

// UI: Set Default form
function setDefaultForm() {
    $('#add-user').reset();
    const navLinks = $$('.nav-tabs .nav-link');
    const tabPanes = $$('.tab-content .tab-pane');

    const navLinkActive = $('.nav-tabs .nav-link.active');
    navLinkActive.classList.remove('active');
    navLinks[0].classList.add('active');

    const tabPaneActive = $('.tab-content .tab-pane.active.show');
    tabPaneActive.classList.remove('show', 'active');
    tabPanes[0].classList.add('show', 'active');
}

// OOP: Add user
export function HandleAddPerson(typeUser) {
    const validator = new Validator('#add-user');
    validator.onSubmit = function (data) {
        let newUser = {};
        switch (typeUser) {
            case 'student':
                newUser = new Student(data.id, data.name, data.address, data.email, 'Student', data.math, data.physical, data.chemistry);
                break;
            case 'employee':
                newUser = new Employee(data.id, data.name, data.address, data.email, 'Employee', data.daysWorked, data.salary);
                break;
            case 'customer':
                newUser = new Customer(data.id, data.name, data.address, data.email, 'Customer', data.companyName, data.invoice, data.rating);
                break;
        }

        listPerson.AddUserMethod(newUser);
        SetLocalStorages(listPerson.list);
        RenderUserList();

        $('#closeAddPerson').click();
        setDefaultForm();
        showNotice('Added successful!');
    };
}

// OOP: Delete user
export function HandleDeleteUser(id) {
    listPerson.DeleteUserMethod(id);
    RenderUserList();
    SetLocalStorages(listPerson.list);
    showNotice('Delete successful!', 'delete');
}

// // Get product and show modal
// export async function getEditProduct(id) {
//     const ProductList = await api.getProduct();
//     const index = ProductList.findIndex(p => p.id === id);

//     if (index !== -1) {
//         $('#productName').value = ProductList[index].name;
//         $('#productSize').value = ProductList[index].size;
//         $('#productPrice').value = ProductList[index].price;
//         $('#productDiscount').value = ProductList[index].discount;
//         $('#productImg').value = ProductList[index].img;
//         $('#productDesc').value = ProductList[index].desc;
//         $('#productQty').value = ProductList[index].qty;

//         const discount = $('#productDiscount').value;
//         const price = $('#productPrice').value;
//         $('#productSalePrice').value = discount ? (price * ((100 - discount) / 100)).toFixed(2) : '';
//     }
// }

// // Edit product và render product
// export async function handleEditProduct(product, id, index) {
//     await api.putProduct(product, id);

//     setUIDashboard(index);
//     showNotice('Edit successful!');
// }

// // Pagination
// export function Paginate(arr) {
//     const itemsPage = 10;
//     const pageNum = Math.ceil(arr.length / 10);

//     const paginate = Array.from({ length: pageNum }, (_, i) => {
//         const index = i * itemsPage;
//         return arr.slice(index, index + itemsPage);
//     });
//     return paginate;
// }

// // Render button
// export function renderButton(dataPageList, active) {
//     const pageButton = dataPageList.map((_, i) => {
//         return `
//             <li class="page-item">
//                 <button data-index="${i}" class="page page-num ${i === parseInt(active) ? 'active' : null}">${i + 1}</button>
//             </li>
//         `;
//     });

//     const preBtn = `<li class="page-item">
//                         <button data-index="pre" class="page page-control">
//                             <i class="fa-solid fa-angle-left"></i>
//                         </button>
//                     </li>`;
//     const nextBtn = `<li class="page-item">
//                         <button data-index="next" class="page page-control">
//                             <i class="fa-solid fa-angle-right"></i>
//                         </button>
//                     </li>`;
//     pageButton.unshift(preBtn);
//     pageButton.push(nextBtn);

//     $('.content-footer').style.display = 'block';
//     $('#dbPagination').innerHTML = pageButton.join('');
// }

// export async function setUIDashboard(index) {
//     const data = await api.getProduct();
//     data.reverse();
//     const page = Paginate(data);
//     RenderListProduct(page[index]);
//     renderButton(page, index);
// }

// // sortAscending
// export async function sortAscending() {
//     const data = await api.getProduct();
//     data.sort((a, b) => a.price - b.price);
//     RenderListProduct(data);
//     $('.content-footer').style.display = 'none';
// }

// // sortDescending
// export async function sortDescending() {
//     const data = await api.getProduct();
//     data.sort((a, b) => b.price - a.price);
//     RenderListProduct(data);
//     $('.content-footer').style.display = 'none';
// }

// // Reset form
// export function resetForm() {
//     const inputs = $('#addProductForm').querySelectorAll('.form-group.invalid');
//     const message = $('#addProductForm').querySelectorAll('.form-group.invalid .form-message');

//     $('#addProductForm').reset();
//     for (let i = 0; i < inputs.length; i++) {
//         inputs[i].classList.remove('invalid');
//         message[i].innerHTML = '';
//     }
// }

// // Seach by Name
// export async function searchByName() {
//     // Chuyển value về dạng: xóa khoảng trắng, chữ thường, không dấu.
//     const keyInput = $('#searchNameInput').value.trim().toLowerCase();
//     const inputName = keyInput.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

//     const data = await api.getProduct();
//     const filteredData = data.filter(p => {
//         const nameLowerCase = p.name.toLowerCase();
//         const dataName = nameLowerCase.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

//         return dataName.includes(inputName);
//     });

//     if (filteredData.length && keyInput.length) {
//         RenderListProduct(filteredData);
//         $('.content-footer').style.display = 'none';
//     } else {
//         showNotice('No results found!', 'no result');
//         setUIDashboard(0);
//     }
// }

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
