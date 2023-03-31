@@ -0,0 +1,119 @@
actor = canvas.tokens.controlled[0].actor;
maxSpellLevel = Math.floor((actor.classes.cleric.system.levels + 1) / 2) - 1;
hitDice = actor.system.attributes.hd;
if (hitDice == 0){
	return ui.notifications.error("No hit dice to spend");
}

let spellList = actor.items.filter(item => item.type == "spell" && item.system.level <= maxSpellLevel && item.system.preparation.prepared && item.system.description.value.includes("At Higher Levels"));

let optionsText = "";
for (let spell of spellList) {
    level = spell.system.level;
    slots = getSpellSlots(actor, level);
    if (slots.value > 0){
    	name = spell.name;
    	label = game.i18n.format('DND5E.SpellLevelSlot', {level: level, n: slots.value});
    	optionsText += `<option value="${level},${name}">${name} - ${label}</option>`;
    }
}
if (optionsText == ""){
    return ui.notifications.error(`No available spell slots of level ${maxSpellLevel} or lower.`)
}

let hdOptions = "";
for (let i = 1; i <= hitDice; i++){
	hdOptions += `<option value="${i}">${i}</option>`;
}

let confirmed = false;
let chosenSpell = null;
let slotLevel = 0;
let hitDiceSpent = 0;
let dialog = new Promise((resolve, reject) => { 
    new Dialog({
    title: "Potent Blood Cast Spell",
    content: `
    <form id="potent-blood-form">
        <p>Choose a spell to upcast using hit dice (all options in drop down are valid).</p>
        <div class="form-group">
            <label>Spell</label>
            <div class="form-fields">
                <select name="spell">` + optionsText + `</select>
            </div>
        </div>
        <div class="form-group">
            <label>Hit Dice</label>
            <div class="form-fields">
                <select name="hd">` + hdOptions + `</select>
            </div>
        </div>
    </form>
    `,
    buttons: {
        one: {
            icon: '<i class="fas fa-check"></i>',
            label: "Cast",
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
    	let values = html.find('[name=spell]')[0].value.split(',');
        chosenSpell = {level: parseInt(values[0]), name: values[1]};
        hitDiceSpent = parseInt(html.find('[name=hd]')[0].value);
    }
  }).render(true);
});
confirmed = await dialog;

if (!confirmed) return;

const item = actor.items.getName(chosenSpell.name);
const upcastLevel = item.system.level + hitDiceSpent;
if (upcastLevel > (maxSpellLevel+1)){
	return ui.notifications.error("Spent too many hit dice, new spell level is greater than you are able to cast.");
}

const hdSpentUpdate = actor.classes.cleric.system.hitDiceUsed + hitDiceSpent;
actor.classes.cleric.update({"system.hitDiceUsed": hdSpentUpdate});

chosenSpellSlotsLeft = actor.system.spells[`spell${chosenSpell.level}`].value;
let objUpdate = new Object();
objUpdate['system.spells.spell' + chosenSpell.level + '.value'] = chosenSpellSlotsLeft - 1;
actor.update(objUpdate);

const workflowItemData = duplicate(item);

if (workflowItemData.system.damage.parts.length > 0){
	bonusDamage = hitDiceSpent * actor.system.abilities.con.mod;
	workflowItemData.system.damage.parts[0][0] += ` + ${bonusDamage}`;
	scaling = workflowItemData.system.scaling;
	if (scaling.mode == "level"){
		if (scaling.formula.includes("@item.level")){
            let formula = " + " + scaling.formula.replace('@item.level', `${upcastLevel}`);
            workflowItemData.system.damage.parts[0][0] += formula;
        } else {
            let stringScaleDice = scaling.formula.split('d')[0];
            let scaleDice = parseInt(stringScaleDice) * (upcastLevel - workflowItemData.system.level);
            let formula = " + " + scaling.formula.replace(stringScaleDice, `${scaleDice}`);
            workflowItemData.system.damage.parts[0][0] += formula;
        }	
	}
}
workflowItemData.system.level = upcastLevel;
workflowItemData.system.preparation.mode = "atwill";
workflowItemData.system.uses = {max: null, per: "", value: null};

const spellItem = new CONFIG.Item.documentClass(workflowItemData, { parent: actor })
const options = { showFullCard: true, createWorkflow: true, versatile: false, configureDialog: false };
await MidiQOL.completeItemRoll(spellItem, options);

function getSpellSlots(actor, level) {
    return actor.system.spells[`spell${level}`];
}