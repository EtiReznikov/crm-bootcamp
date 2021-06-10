
const fieldStatus= { 
    name: true, 
    phone: true,
    email: true
}

function nameValidation(e) {
    const name = document.getElementById("name").value;
    const isValidName = /^[a-zA-Z\s]*$/.test(name);
    if (isValidName) {
        document.getElementById("name-error").innerHTML = "";
        fieldStatus.name= true;
    }
    else {
        document.getElementById("name-error").innerHTML = "Oops! Your name can only contain letters and spaces";
        fieldStatus.name= false;
    }
}

function nameLengthValidation(){
    const name = document.getElementById("name").value;
    if (name.length<2){
        fieldStatus.name= false;
        document.getElementById("name-error").innerHTML = "Oops,Your name must contain at least 2 letters";
    }
}

function phoneValidation(e) {
    const phoneNumber = document.getElementById("phone").value;
    const isOnlyDigit = /^\d+$/.test(phoneNumber);
    if (isOnlyDigit) {
        fieldStatus.phone= true;
        document.getElementById("phone-error").innerHTML = "";
    }
    else {
        fieldStatus.phone= false;
        document.getElementById("phone-error").innerHTML = "Oops! A phone number should contain only numbers";
    }  
}

function phoneLengthValidation(){
    const phone = document.getElementById("phone").value;
    if (phone.length!=7){
        fieldStatus.phone= false;
        document.getElementById("phone-error").innerHTML = "Oops! A phone number should exactly 7 digits";
    }
}


function emailValidation() {
    const email = document.getElementById("email").value;
    const validEmail = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(email);
    if(validEmail){
        fieldStatus.email= true;
        document.getElementById("email-error").innerHTML = "";
    }
    else if (email.length==0){
        fieldStatus.email= false;
        document.getElementById("email-error").innerHTML = "Oops! Email address is required";
    }
    else if (!validEmail){
        fieldStatus.email= false;
        document.getElementById("email-error").innerHTML = "Oops! Invalid email address";
    }
 

}

document.getElementById("form").addEventListener("submit", formValidation);

function formValidation(e) {
    const form = document.forms.form;
    nameLengthValidation();
    phoneLengthValidation()
    emailValidation();
   if (Object.keys(fieldStatus).some(key => !fieldStatus[key])) {
    e.preventDefault();
   }
}

