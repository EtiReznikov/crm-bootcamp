document.addEventListener("DOMContentLoaded", function (event) {
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
    axios.post('http://localhost:8004/leads', leadsOptions)
        .then(function (response) {
            const leads = response.data;
            let new_tbody = document.createElement('tbody');
            let tbody = document.getElementById('tbody');

            for (lead of leads) {
                let newTr = document.createElement('tr');
                for (let key in lead) {
                    if (lead.hasOwnProperty(key)) {
                        let newTd = document.createElement('td');
                        newTd.innerText = lead[key];
                    }
                    newTr.appendChild(newTd);
                }
                new_tbody.appendChild(newTr);
            }
            tbody.innerHTML = new_tbody.innerHTML
        })
        .catch(function (error) {
            console.log(error);
        });
}