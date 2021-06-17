document.addEventListener("DOMContentLoaded", function(event) {
    //do work
    getLeadsPost();
});

const getLeadsPost = () => {
    axios.post('http://crossfit.com:8004/leads', {
            name: 'test',
            phone: '',
            email: '',
            gender: '',
            updatesConfirm: ''
        })
        .then(function(response) {
            console.log(response.data.leads)


        })
        .catch(function(error) {
            console.log(error);
        });
}