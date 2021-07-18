

export function getNextDay(dayName, hour, minutes, weekDiff) {

	// The current day
	var date = new Date();
	var now = date.getDay();

	// Days of the week
	var days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

	// The index for the day you want
	var day = days.indexOf(dayName.toLowerCase());

	// Find the difference between the current day and the one you want
	// If it's the same day as today (or a negative number), jump to the next week
	var diff = day - now;
	diff = weekDiff * 7 + diff;


	// Get the timestamp for the desired day
	var nextDayTimestamp = date.getTime() + (1000 * 60 * 60 * 24 * diff);
	var dateResult = new Date(nextDayTimestamp);
	dateResult.setHours(hour, minutes)
	// Get the next day
	return new Date(dateResult);
};


export function diffDate(startDate, endDate){
	const diffTime = endDate - startDate;
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
	return diffDays
}