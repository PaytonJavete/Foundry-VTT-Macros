let optionsText = "";
optionsText += `<option value="LFD">Let Fate Decide</option>`;
optionsText += `<option value="Fire">Firestorm</option>`;
optionsText += `<option value="Thunder">Thunderstorm</option>`;
optionsText += `<option value="Snow">Snowstorm</option>`;

let storm = "";
let useLightning = false;
let drType = "";

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
console.log(`Chose ${storm} effct`);
console.log(`useLightning = ${useLightning}`);

uuid = canvas.tokens.controlled[0].actor.uuid;
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
			flair = "sour laughter booms like thunder.";
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
	storm = "Thunder(L)";
}

// Remove all current storms except if current storm same as new storm
removed = removeStorms(storm);
if (!removed){
	return;
}

// Get and edit effect data
let effectData = game.dfreds.effectInterface.findEffectByName(`Raging Storm - ${storm}`).convertToObject();
console.log(effectData);

effectData.flags.core.statusId = "";

game.dfreds.effectInterface.addEffectWith({ effectData, uuid });

async function removeStorms(storm){
	let hasEffectApplied = await game.dfreds.effectInterface.hasEffectApplied('Raging Storm - Fire', uuid);
	if (hasEffectApplied && storm != "Fire") {
	  game.dfreds.effectInterface.removeEffect({ effectName: 'Raging Storm - Fire', uuid });
	  return true;
	}
	hasEffectApplied = await game.dfreds.effectInterface.hasEffectApplied('Raging Storm - Thunder(L)', uuid);
	if (hasEffectApplied && storm != "Thunder(L)") {
	  game.dfreds.effectInterface.removeEffect({ effectName: 'Raging Storm - Thunder(L)', uuid });
	  return true;
	}
	hasEffectApplied = await game.dfreds.effectInterface.hasEffectApplied('Raging Storm - Thunder', uuid);
	if (hasEffectApplied && storm != "Thunder") {
	  game.dfreds.effectInterface.removeEffect({ effectName: 'Raging Storm - Thunder', uuid });
	  return true;
	}
	hasEffectApplied = await game.dfreds.effectInterface.hasEffectApplied('Raging Storm - Snow', uuid);
	if (hasEffectApplied && storm != "Snow") {
	  game.dfreds.effectInterface.removeEffect({ effectName: 'Raging Storm - Snow', uuid });
	  return true;
	}
	return false;
}