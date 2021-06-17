document.addEventListener("DOMContentLoaded", function(event) {
    //do work
    getLeads();
});
const leadsOptions = {
    orderBy: ''
}

function sortBy(type, value) {
    leadsOptions.orderBy = `ORDER BY ${type} ${value}`
        //{
        //     type: type,
        //     value: value
        // }
    getLeads();
}

const getLeads = () => {
    axios.post('http://crossfit.com:8004/leads', leadsOptions)
        .then(function(response) {

            const leads = response.data;
            console.log(leads);
            // var table = document.getElementById('leads-table');
            let new_tbody = document.createElement('tbody');
            var tbody = document.getElementById('tbody');

            for (lead of leads) {
                var newTr = document.createElement('tr');
                console.log(lead);
                for (var key in lead) {
                    if (lead.hasOwnProperty(key)) {
                        console.log(key + " -> " + lead[key]);
                        var newTd = document.createElement('td');
                        newTd.innerText = lead[key];
                    }
                    newTr.appendChild(newTd);
                }
                new_tbody.appendChild(newTr);
            }
            console.log(new_tbody)
            tbody.innerHTML = new_tbody.innerHTML
        })
        .catch(function(error) {
            console.log(error);
        });
}