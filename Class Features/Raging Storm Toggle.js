let optionsText = "";
optionsText += `<option value="LFD">Let Fate Decide</option>`;
optionsText += `<option value="Fire">Firestorm</option>`;
optionsText += `<option value="Thunder">Thunderstorm</option>`;
optionsText += `<option value="Snow">Snowstorm</option>`;

let storm = "";
let useLightning = false;
let confirmed = false;
let dialog = new Promise((resolve, reject) => { 
    new Dialog({
    title: "Raging Storm Effect",
    content: `
    <form id="rs-use-form">
        <div class="form-group">
            <label>Storm Effect</label>
            <div class="form-fields">
                <select name="storm-effct">` + optionsText + `</select>
            </div>
        </div>

        <div class="form-group">
            <label class="checkbox">
            <input type="checkbox" name="useLightningCheckbox" unchecked/>Use Lightning for Thunderstorm (Default Thunder)</label>
        </div>
    </form>
    `,
    buttons: {
        one: {
            icon: '<i class="fas fa-check"></i>',
            label: "A Storm Brews...",
            callback: () => resolve(true)
        },
        two: {
            icon: '<i class="fas fa-times"></i>',
            label: "Cancel",
            callback: () => {resolve(false)}
        }
    },
    default: "Cancel",
    close: html => {
        storm = html.find('[name=storm-effct]')[0].value;
        useLightning = html.find('[name=useLightningCheckbox]')[0].checked;
    }
  }).render(true);
});
confirmed = await dialog;
if(!confirmed){
	return;
}

const uuid = canvas.tokens.controlled[0].actor.uuid;
let flair = "";

// First, choose storm if random
if (storm == "LFD"){
	roll = await new Roll(`1d6`).roll();
	switch(roll.total){
		case 1:
			flair = "your skin assumes the appearance of molten lava when you rage.";
			storm = "Fire";
			break;
		case 2:
			flair = "wooden objects slowly char in your presence.";
			storm = "Fire";
			break;
		case 3:
			flair = "small bolts of electricity crackle through your hair.";
			storm = "Thunder";
			break;
		case 4:
			flair = "your laughter booms like thunder.";
			storm = "Thunder";
			break;
		case 5:
			flair = "frost slowly spreads across surfaces you sit on.";
			storm = "Snow";
			break;
		case 6:
			flair = "your skin is freezing cold to the touch.";
			storm = "Snow";
			break;
	}
	let results_html = `<h2>A Storm Rages!</h2>
	Grout, you feel the power of the raging storm fill you as ${flair}`

	ChatMessage.create({
	user: game.user._id,
	speaker: ChatMessage.getSpeaker({token: actor}),
	content: results_html
	});
}

// Check to see if storm must be set to lightning
if (useLightning && storm == "Thunder"){
	storm = "Lightning";
}

//Remove current storm
let flag = DAE.getFlag(actor, "Storm");
if(flag) await game.dfreds.effectInterface.removeEffect({ effectName: `Raging Storm - ${flag}`, uuid });

//Add new storm
DAE.setFlag(actor, "Storm", storm);
let effectData = await game.dfreds.effectInterface.findEffectByName(`Raging Storm - ${storm}`);
await game.dfreds.effectInterface.addEffectWith({ effectData, uuid });