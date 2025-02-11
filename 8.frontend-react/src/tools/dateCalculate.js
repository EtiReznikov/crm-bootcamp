

export function getNextDay(dayName, hour, minutes, weekDiff) {

	// The current day
	let date = new Date();
	let now = date.getDay();

	// Days of the week
	let days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

	// The index for the day you want
	let day = days.indexOf(dayName.toLowerCase());

	// Find the difference between the current day and the one you want
	// If it's the same day as today (or a negative number), jump to the next week
	let diff = day - now;
	diff = weekDiff * 7 + diff;


	// Get the timestamp for the desired day
	let nextDayTimestamp = date.getTime() + (1000 * 60 * 60 * 24 * diff);
	let dateResult = new Date(nextDayTimestamp);
	dateResult.setHours(hour, minutes)
	// Get the next day
	return new Date(dateResult);
};


export function diffDate(startDate, endDate) {
	const diffTime = endDate - startDate;
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
	return diffDays
}
//from DD/MM/YYYY to MM/DD/YYYY or MM/DD/YYYY to DD/MM/YYYY
export function dateFormattingDayByMonth(date_string) {
	let date_components = date_string.split("/");
	let day = date_components[0];
	if (day.length === 1) {
		day = "0" + day;
	}
	let month = date_components[1];
	if (month.length === 1) {
		month = "0" + month;
	}
	let year = date_components[2];
	return month + "/" + day + "/" + year;
}



