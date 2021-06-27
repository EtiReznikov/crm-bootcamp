

/**
 * 
 * @param {*} e 
 * check while typing if the name doesn't contains invalid chars.
 */

 export function nameValidation(name) {
    const isValidName = /^[a-zA-Z\s]*$/.test(name);
    if (isValidName) {
        return 0;
    } else {
        return 1;
    }
}
/**
 * 
 * 
 * check that the name is at least 2 chars.
 */

export function nameLengthValidation(name) {
    if (name.length < 2) {
        return 2;
        // document.getElementById("name-error").innerHTML = "Oops,Your name must contain at least 2 letters";
    }
    else return nameValidation(name);
}

/**
 * check that the email is valid.
 */

 export function emailValidation(email) {
    const validEmail = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(email);
    if (validEmail) {
        return 0;
    } else if (email.length === 0) {
        return 1;
    } else if (!validEmail) {
        return 2;
    }
}


/**
 * 
 * @param {*} e 
 * check while typing if the phone doesn't contains invalid chars.
 */
export function phoneValidation(phoneNumber) {
    const isOnlyDigit = /^\d+$/.test(phoneNumber);
    if (isOnlyDigit) {
        return 0;
    } else {
        return 1;
    }
}

/**
 * 
 * 
 * check that the name is at least 2 chars.
 */

export function phoneLengthValidation(phone) {
    if (phone.length !== 10) {
        return 2;
    }
    else return phoneValidation(phone);
}


/**
 * 
 * check if password is strong, medium or weak.
 */

export function passwordStrengthValidation(password){
    //password has at least one lowercase letter (?=.*[a-z]), one uppercase letter (?=.*[A-Z]), one digit (?=.*[0-9]), one special character (?=.*[^A-Za-z0-9]), and is at least eight characters long(?=.{8,}).
    const strengthPassword = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/.test(password);
    if (strengthPassword) return 3;
    //If the password is at least six characters long and meets all the other requirements, or has no digit but meets the rest of the requirements.
    const mediumPassword= /((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,}))|((?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}))/.test(password);
    if (mediumPassword) return 2;
    // Password contain at least 8 characters, one letter and one number" 
    const weakPassword= /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);
    if (weakPassword) return 1;
    return 0;
}

/**
 * 
 * check if password has Minimum eight characters, at least one letter and one number:
 */

 export function passwordMatchValidation(password, confirm){
    if (password === confirm){
        return 0;
    }
       
    return 1;
}


