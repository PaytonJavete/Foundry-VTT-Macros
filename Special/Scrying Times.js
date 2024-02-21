//intereseted parties = 3 (Gildrales, Zinnoda, King Kalanthar)
let intParties = []
intParties.push({scry: getRandomInt(100) <= 90 ? true : false, name: 'Gildrales'});
intParties.push({scry: getRandomInt(100)  <= 70 ? true : false, name: 'Zinnoda'});
intParties.push({scry: getRandomInt(100) <= 50 ? true : false, name: 'King Kalanthar'});
let time = SimpleCalendar.api.currentDateTime();
let message = `<h2>Scrying Times: ${time.month+1}/${time.day+1}</h2>`;
let numScry = 0;

intParties.forEach(function (party, index) {
	if (!party.scry) return;
	numScry += 1;
	timeHour = getRandomInt(16) + 4;
	if(timeHour < 10) timeHour = `0${timeHour}`;
	timeMinute = getRandomInt(60) - 1;
	if(timeMinute < 10) timeMinute = `0${timeMinute}`;
	message += `${party.name} scries on the party at ${timeHour}:${timeMinute}.<br>`;
});

if(numScry == 0) message += "No scrying today.";

ChatMessage.create({
	user: game.user._id,
	speaker: ChatMessage.getSpeaker({token: actor}),
	whisper: [game.user],
	content: message
});

function getRandomInt(max) {
  return Math.ceil(Math.random() * max);
}