import axios from "axios";
let events = []
const listenToEvents = (window) => {

    const sendEvents = () => {
        let copyEvents = events.slice();
        events = [];
        axios.post('http://localhost:3030/api/v1/multipleEvents', {
            events: copyEvents
        })
            .then(function (response) {
                console.log(response)
            })
            .catch(function (error) {
                console.log(error)
            });
    }

    const insertAll = () => {
        const interval = setInterval(() => {
            sendEvents();
        }, 20000);
        return () => clearInterval(interval);
    }
    insertAll();
    window.addEventListener("click", (event) => {
        let date = new Date()
        let index = { _index: 'events_dom', _type: 'events' };
        events.push({ index: index });
        events.push({
            href: event.target.href,
            type: event.type,
            id: event.target.id,
            class: event.target.className,
            time: date
        })
    });
}

export { listenToEvents };