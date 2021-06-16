const fieldStatus = {
    name: true,
    phone: true,
    email: true
}

/**
 * 
 * @param {*} e 
 * check while typing if the name doesn't contains invalid chars.
 */

function nameValidation(e) {
    const name = document.getElementById("name").value;
    const isValidName = /^[a-zA-Z\s]*$/.test(name);
    if (isValidName) {
        document.getElementById("name-error").innerHTML = "";
        fieldStatus.name = true;
    } else {
        document.getElementById("name-error").innerHTML = "Oops! Your name can only contain letters and spaces";
        fieldStatus.name = false;
    }
}
/**
 * 
 * 
 * check that the name is at least 2 chars.
 */

function nameLengthValidation() {
    const name = document.getElementById("name").value;
    if (name.length < 2) {
        fieldStatus.name = false;
        document.getElementById("name-error").innerHTML = "Oops,Your name must contain at least 2 letters";
    }
}
/**
 * 
 * @param {*} e 
 * check while typing if the phone doesn't contains invalid chars.
 */
function phoneValidation(e) {
    const phoneNumber = document.getElementById("phone").value;
    const isOnlyDigit = /^\d+$/.test(phoneNumber);
    if (isOnlyDigit) {
        fieldStatus.phone = true;
        document.getElementById("phone-error").innerHTML = "";
    } else {
        fieldStatus.phone = false;
        document.getElementById("phone-error").innerHTML = "Oops! A phone number should contain only numbers";
    }
}

/**
 * 
 * 
 * check that the name is at least 2 chars.
 */

function phoneLengthValidation() {
    const phone = document.getElementById("phone").value;
    if (phone.length != 7) {
        fieldStatus.phone = false;
        document.getElementById("phone-error").innerHTML = "Oops! A phone number should exactly 7 digits";
    }
}
/**
 * check that the email is valid.
 */

function emailValidation() {
    const email = document.getElementById("email").value;
    const validEmail = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(email);
    if (validEmail) {
        fieldStatus.email = true;
        document.getElementById("email-error").innerHTML = "";
    } else if (email.length == 0) {
        fieldStatus.email = false;
        document.getElementById("email-error").innerHTML = "Oops! Email address is required";
    } else if (!validEmail) {
        fieldStatus.email = false;
        document.getElementById("email-error").innerHTML = "Oops! Invalid email address";
    }


}

/**
 * check that the all form fill is valid, when the user submit it
 */

function formValidation(e) {
    const form = document.forms.form;
    e.preventDefault();
    // nameLengthValidation();
    // phoneLengthValidation()
    // emailValidation();
    // if (Object.keys(fieldStatus).some(key => !fieldStatus[key])) {
    //     e.preventDefault();
    // }
    axios.post('http://crossfit.com:8004', {
            name: document.getElementById("name").value,
            phone: document.getElementById("phone").value,
            email: document.getElementById("email").value,
            gender: form.querySelector('input[name=gender]:checked') != null ? form.querySelector('input[name=gender]:checked').value : '',
            moreInfo: document.getElementById("more-info") != null ? document.getElementById("more-info").value : '',
            updatesConfirm: document.getElementById("email-permission").checked
        })
        .then(function(response) {
            if (!response.data.flag) {
                console.log("error");
                document.getElementById("form-error").innerHTML = "Oops! Something is wrong with your data";
                e.preventDefault();
                console.log("Something is wrong with user data");
            } else {
                window.location.href = '/submitted?name=' + response.data.name;
                console.log(response);
            }
        })
        .catch(function(error) {
            console.log(error);
        });
}