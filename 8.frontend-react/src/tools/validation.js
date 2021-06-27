

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
        return true;
    } else {
        return false;
    }
}

/**
 * 
 * 
 * check that the name is at least 2 chars.
 */

export function phoneLengthValidation(phone) {
    if (phone.length !== 7) {
        return 2;
        // document.getElementById("phone-error").innerHTML = "Oops! A phone number should exactly 7 digits";
    }
    else return phoneValidation(phone);
}


/**
 * 
 * check if password has Minimum eight characters, at least one letter and one number:
 */

export function passwordStrengthValidation(password){
    const isStrengthPassword= /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);
    if (isStrengthPassword) return 0;
    return 1;
}

/**
 * 
 * check if password has Minimum eight characters, at least one letter and one number:
 */

 export function passwordMatchValidation(password, confirm){
    console.log(password);
    console.log(confirm)
    if (password === confirm){
        return 0;
    }
       
    return 1;
}


