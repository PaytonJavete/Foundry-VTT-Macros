const lastArg = args[args.length-1];
const uuid = lastArg.actorUuid;
token = canvas.tokens.get(lastArg.tokenId);
actor = token.actor;
specialIgnoredSpells = ["Scorching Ray", "Magic Missile"];

let spellList = actor.items.filter(item => item.type == "spell" && item.system.level <= 5 && (item.system.activation.type == "action" || item.system.activation.type == "bonus") && (item.system.level == 0 || item.system.preparation.prepared) && ((item.system.range.units == "self" && item.system.target.type == "self") || item.system.target.type == "creature") && (item.system.damage.parts.length == 0 || item.system.actionType == "heal"));

let optionsText = "";
for (let spell of spellList) {
    level = spell.system.level;
    name = spell.name;
    if (hasAvailableSlot(actor, level) && !specialIgnoredSpells.includes(name)){
        optionsText += `<option value="${level},${name}">${name}</option>`;
    }
}
if (optionsText == ""){
    return ui.notifications.error("No available spell slots of level 5 or lower.")
}

let confirmed = false;
let chosenSpell = null;
let slotLevel = 0;
let dialog = new Promise((resolve, reject) => { 
    new Dialog({
    title: "Contingency Activation Spell",
    content: `
    <form id="contingency-form">
        <p>Choose a spell to store as a contingenet spell (all options in drop down are valid).</p>
        <div class="form-group">
            <label>Spell</label>
            <div class="form-fields">
                <select name="spell">` + optionsText + `</select>
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
    }
  }).render(true);
});
confirmed = await dialog;

if (!confirmed){
	return;
}

if (chosenSpell == null){
	return ui.notifications.error("Contingency spell returned null");
}
spellLevel = chosenSpell.level;
spellName = chosenSpell.name;

if (spellLevel != 0){
    let optionsText = "";
    for (let i = spellLevel; i <= 5; i++) {
        const slotsLeft = actor.system.spells[`spell${i}`].value;
        if (slotsLeft > 0) {
            const level = CONFIG.DND5E.spellLevels[i];
            const label = game.i18n.format('DND5E.SpellLevelSlot', {level: level, n: slotsLeft});
            optionsText += `<option value="${i}">${label}</option>`;
        }
    }

    let confirmed = false;
    let consumeSlot = true;
    let dialog = new Promise((resolve, reject) => { 
        new Dialog({
        title: "Spell Used with Contingency",
        content: `
        <form id="smite-use-form">
            <p>Choose the level ${spellName} should be cast at:</p>
            <div class="form-group">
                <label>Spell Slot Level</label>
                <div class="form-fields">
                    <select name="slot-level">` + optionsText + `</select>
                </div>
            </div>

            <div class="form-group">
                <label class="checkbox">
                <input type="checkbox" name="consumeCheckbox" checked/>` + game.i18n.localize("DND5E.SpellCastConsume") + `</label>
            </div>
        </form>
        `,
        buttons: {
            one: {
                icon: '<i class="fas fa-check"></i>',
                label: "Spend Slot",
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
            slotLevel = parseInt(html.find('[name=slot-level]')[0].value);     
            consumeSlot = html.find('[name=consumeCheckbox]')[0].checked;
        }
      }).render(true);
    });
    confirmed = await dialog;

    if (!confirmed){
        return;
    }

    if (consumeSlot){
        chosenSpellSlotsLeft = actor.system.spells[`spell${spellLevel}`].value;
        let objUpdate = new Object();
        objUpdate['system.spells.spell' + slotLevel + '.value'] = chosenSpellSlotsLeft - 1;
        actor.update(objUpdate);      
    }
}

const dataTracker = {
    name: spellName,
    level: slotLevel,
};
await DAE.setFlag(actor, "ContingencyTracker", dataTracker);

let effect = actor.effects.find(effect => effect.label.includes("Contingency"));
if (effect != undefined){
    effect.delete();
}

const effectData = game.dfreds.effectInterface.findEffectByName('Contingency Proc').data;
effectData.name += ` (${spellName})`;

game.dfreds.effectInterface.addEffectWith({ effectData, uuid });

function hasAvailableSlot(actor, level) {
    for (let i = level; i <= 5; i++) {
        if (actor.system.spells[`spell${i}`].value > 0) {
            return true;
        }
    }
    return false;
}