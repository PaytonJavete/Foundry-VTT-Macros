// Use before casting spell. Then cast spell without consuming spell slot.

let s_actor = canvas.tokens.controlled[0].actor;
let spellLevel = 0;
let upcastLevel = 0;
const item = actor.items.getName("Core of the Meteor");
let value = item.system.uses.value;
let max = item.system.uses.max;

// Get options for available slots
let optionsText = "";
let i = 1;
for (; i < 10; i++) {
    const slots = getSpellSlots(s_actor, i);
    if (slots.max > 0) {
        const level = CONFIG.DND5E.spellLevels[i];
        const label = game.i18n.format('DND5E.SpellLevelSlot', {level: level, n: slots.value});
        optionsText += `<option value="${i}">${label}</option>`;
    }
}

let dialog = new Promise((resolve, reject) => { 
    new Dialog({
    title: `Core of the Meteor (Charges Left: ${value}/${max})`,
    content: `
    <form id="CM-use-form">
        <p>` + game.i18n.format("DND5E.AbilityUseHint", {name: "Core Upcast", type: "item"}) + `</p>
        <div class="form-group">
            <label>Base Level of Spell</label>
            <div class="form-fields">
                <select name="spell-level">` + optionsText + `</select>
            </div>
        </div>

        <div class="form-group">
            <label>Upcast Level</label>
            <div class="form-fields">
                <select name="upcast-level">` + optionsText + `</select>
            </div>
        </div>
    </form>
    `,
    buttons: {
        one: {
            icon: '<i class="fas fa-check"></i>',
            label: "Upcast!",
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
        spellLevel = parseInt(html.find('[name=spell-level]')[0].value);
        upcastLevel = parseInt(html.find('[name=upcast-level]')[0].value);
    }
  }).render(true);
});
confirmed = await dialog;

if (confirmed){
	// Check and subtract charges from Core of the Meteor
    const item = actor.items.getName("Core of the Meteor");
	let updateValue = value - (upcastLevel - spellLevel);
	if (updateValue < 0){
		ui.notifications.error("Not enough charges available.");
    	return;
	}
	await item.update({"system.uses.value": updateValue});

	// Update spell slot of base level
	let chosenSpellSlots = getSpellSlots(actor, spellLevel);
	let objUpdate = new Object();   
    objUpdate['system.spells.spell' + spellLevel + '.value'] = chosenSpellSlots.value - 1;    
    s_actor.update(objUpdate);

    console.log(`Core of the Meteor ${value - updateValue} charges used out of current ${value} charges.`);
    console.log(`${spellLevel} level spell consumed.`);
}

function getSpellSlots(actor, level) {
    return actor.system.spells[`spell${level}`];
}