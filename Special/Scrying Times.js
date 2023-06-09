//intereseted parties = 3 (Gildrales, Zinnoda, King Kalanthar)
let intParties = ['Gildrales', 'Zinnoda', 'King Kalanthar'];
let scryRoll = await new Roll("1d4").evaluate({async: true});
let numScry = scryRoll.total - 1;
let message = "";
if(numScry == 0) message = "No scrying today.";

for (let i = 0; i < numScry; i++){
	index = Math.floor(Math.random()*intParties.length);
	party = intParties.splice(index, 1);
	hourRoll = await new Roll("1d24").evaluate({async: true});
	timeHour = hourRoll.total - 1;
	if(timeHour < 10) timeHour = `0${timeHour}`;
	minuteRoll = await new Roll("1d60").evaluate({async: true});
	timeMinute = minuteRoll.total - 1;
	if(timeMinute < 10) timeMinute = `0${timeMinute}`;
	message += `${party} scries on the party at ${timeHour}:${timeMinute}.<br>`;
}

ChatMessage.create({
	user: game.user._id,
	speaker: ChatMessage.getSpeaker({token: actor}),
	whisper: [game.user],
	content: message
});