var testfunction = function() {

    var selector = document.querySelector('body');
    selector.style.backgroundColor = '#'+Math.random().toString(16).substr(-6);

}
let numberRegExp= new RegExp('^[0-9]+$');
var phoneValidation= function(){
    var phoneNumber = document.getElementById('phone').value;
    if (numberRegExp.test(phoneNumber) === true){
        document.getElementById("Text1").value = "";
    }
    else {
            document.getElementById("Text1").value = "Oops ";
    }
 
}