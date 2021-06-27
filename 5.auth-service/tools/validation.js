/**
 * 
 * @param {*} name
 * check that the name is valid.
 */

 function nameValidation(name) {
    const isValidName = /^[a-zA-Z\s]*$/.test(name);
    if (!isValidName || name.length < 2) {
        return false;
    } return true;
}

/**
 * 
 * @param {*} phoneNumber 
 * check that the phoneNumber is valid.
 */
 function phoneValidation(phoneNumber) {
    const isOnlyDigit = /^\d+$/.test(phoneNumber);
    if (!isOnlyDigit || phoneNumber.length != 10) {
        return false;
    } return true;
}

/**
 * @param {*} email
 * check that the email is valid.
 */
 function emailValidation(email) {
    const validEmail = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(email);
    if (!validEmail  || email.length == 0) {
        return false;
    } return true;

}
/**check if password is strong enough and match to confirm password */
 function passwordValidation(password, confirm) {
    if (password !== confirm) {
        return false;
    }

    //password has at least one lowercase letter (?=.*[a-z]), one uppercase letter (?=.*[A-Z]), one digit (?=.*[0-9]), one special character (?=.*[^A-Za-z0-9]), and is at least eight characters long(?=.{8,}).
    const strengthPassword = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/.test(password);

    //If the password is at least six characters long and meets all the other requirements, or has no digit but meets the rest of the requirements.
    const mediumPassword = /((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,}))|((?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}))/.test(password);

    // Password contain at least 8 characters, one letter and one number" 
    const weakPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);

    if (strengthPassword || mediumPassword || weakPassword) {
        return true;
    }
    return false;
}


module.exports = {nameValidation,phoneValidation, emailValidation,  passwordValidation}