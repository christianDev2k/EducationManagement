/**
 * - DOM element form.
 * - Từ element form lấy ra các input có attribute name và rules.
 * - Tạo ra object Form rules và lặp qua các input truyền vào key: value (name: rules)
 */
function Validator(formSelector) {
    // ================== ĐỊNH NGHĨA VALIDATE METHOD =========================

    // Hàm thực thi validate
    function handleValidate(e) {
        // Từ e.target lấy ra name và value để trích xuất hàm ra để thực thi validate
        const rules = formRules[e.target.name];
        let errorMessage;

        // Lấy method test ra kiểm tra và trả về kết quả tại đây.
        for (let rule of rules) {
            switch (e.target.type) {
                case 'radio':
                case 'checkbox':
                    const radioChecked = formElement.querySelector('[name="' + e.target.name + '"]:checked');
                    errorMessage = rule(radioChecked);
                    break;
                default:
                    errorMessage = rule(e.target.value);
            }

            if (errorMessage) break;
        }

        // Thực thi HTML validate.
        const formGroup = getParent(e.target, '.form-group');
        const formMessage = formGroup.querySelector('.form-message');

        if (errorMessage) {
            formGroup.classList.add('invalid');
            if (formMessage) {
                formMessage.innerHTML = errorMessage;
            }
        }
        return !errorMessage;
    }

    // Hàm get parent Element
    function getParent(element, selector) {
        while (element.parentElement) {
            if (element.parentElement.matches(selector)) {
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }

    // Tạo 1 object chứa các method để thực hiện validate.
    // Nếu có lỗi trả về Error Message. Đúng trả về undefined.
    const ValidatorRules = {
        // Xử dụng shorthand method syntax của ES6 thay vì viết kiểu thông thường của ES5
        required(value) {
            return value ? undefined : 'Please enter this field!';
        },
        email(value) {
            const regex = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
            return regex.test(value) ? undefined : 'This field must have a ID!';
        },
        min(min) {
            return function (value) {
                return value.length >= min ? undefined : `Vui lòng nhập tối thiểu ${min} kí tự`;
            };
        },
        max(max) {
            return function (value) {
                return value.length <= max ? undefined : `Vui lòng nhập tối đa ${max} kí tự`;
            };
        },
        number(value) {
            return !isNaN(value) ? undefined : 'This field is a number!';
        },
    };

    // DOM element form
    const formElement = document.querySelector(formSelector);

    // ================== PHÂN TÍCH DOM => OBJECT ==> EVENT VALIDATE =========================

    // Chuyển mô tả từ DOM sang dạng OBJECT để dễ xử lí hơn
    const formRules = {};
    if (formElement) {
        // Lấy ra tất cả input trong form có attribute rule và name.
        const inputs = formElement.querySelectorAll('[name][rules]:not([disabled])');
        // Lặp qua các input
        for (let input of inputs) {
            const rules = input.getAttribute('rules').split('|');
            for (let rule of rules) {
                // Tách | và : để lấy ra rule (key)
                if (rule.includes(':')) {
                    const ruleInfor = rule.split(':');

                    // ruleInfor[0] = 'min, ruleInfor[1] = 6
                    rule = ruleInfor[0];
                    const value = ruleInfor[1];

                    // Chạy function min truyền vào giá trị min => nhận lại được function validate và gán vào object
                    ValidatorRules[rule] = ValidatorRules[rule](value);
                }

                const ruleFunc = ValidatorRules[rule];

                // Gán function validate vào từng key
                Array.isArray(formRules[input.name]) ? Array.isArray(formRules[input.name].push(ruleFunc)) : (formRules[input.name] = [ruleFunc]);
            }

            // Sau khi hoàn thành xong bản mô tả => Bắt sự kiện input, blur để check validate.
            input.onblur = handleValidate;
            input.oninput = handleClearError;
        }

        // Hàm clear validate
        function handleClearError(e) {
            const formGroup = getParent(e.target, '.form-group');
            const formMessage = formGroup.querySelector('.form-message');

            if (formGroup.classList.contains('invalid')) {
                formGroup.classList.remove('invalid');
                formMessage.innerHTML = '';
            }
        }
    }

    // ================== XỬ LÍ EVENT SUBMIT FORM =========================

    formElement.onsubmit = e => {
        e.preventDefault();

        // Lặp qua các input
        const inputs = formElement.querySelectorAll('[name][rules]:not([disabled])');
        let isValid = true;
        // for (let input of inputs) {
        //     !handleValidate({ target: input }) ? (isValid = false) : null;
        // }

        if (isValid) {
            if (typeof this.onSubmit === 'function') {
                const enableInputs = formElement.querySelectorAll('[name]:not([disabled])');
                const formValues = Array.from(enableInputs).reduce((values, input) => {
                    switch (input.type) {
                        case 'radio':
                            const radioChecked = formElement.querySelector('input[name="' + input.name + '"]:checked');
                            values[input.name] = radioChecked.value;
                            break;
                        case 'checkbox':
                            if (!input.matches(':checked')) {
                                values[input.name] = '';
                                return values;
                            }

                            if (!Array.isArray(values[input.name])) {
                                values[input.name] = [];
                            }
                            values[input.name].push(input.value);
                            break;
                        case 'file':
                            values[input.name] = input.files;
                            break;
                        default:
                            values[input.name] = input.value;
                    }
                    return values;
                }, {});

                this.onSubmit(formValues);
            } else {
                formElement.submit();
            }
        }
    };
}

export default Validator;
