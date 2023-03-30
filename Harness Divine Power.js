const lastArg = args[args.length-1];

actor = canvas.tokens.get(lastArg.tokenId).actor;
slotLevel = 0;
maxSpellLevel = Math.ceil(actor.system.attributes.prof / 2);

// Get options for missing spell slots, and spell level 5 or less
let optionsText = "<option value='0'>None</option>";
for (i = 1; i <= maxSpellLevel; i++) {
    const slots = getSpellSlots(actor, i);
    if (slots.max > 0 && slots.max != slots.value) {
        const level = CONFIG.DND5E.spellLevels[i];
        const label = game.i18n.format('DND5E.SpellLevelSlot', {level: level, n: `${slots.value}/${slots.max}`});
        optionsText += `<option value="${i}">${label}</option>`;
    }
}

let dialog = new Promise(async (resolve, reject) => {
    new Dialog({
        title: "Harness Divine Power",
        content: `
        <form id="NR-use-form" name="Harness Divine Power Window">
            <p>` + game.i18n.format("DND5E.AbilityUseHint", {name: "Harness Divine Power", type: "feature"}) + `</p>
                <div id="spell-form-NR" class="form-group">
                    <label>Restore Spell</label>
                    <div class="form-fields">
                        <select name="spell-level">` + optionsText + `</select>
                    </div>
                </div>
        </form>
        `,
        buttons: {
            one: {
                icon: '<i class="fas fa-check"></i>',
                label: "Confirm",
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
            slotLevel = parseInt(html.find('[name=spell-level]')[0].value);
        }
    }).render(true);
});
confirmed = await dialog;

if(!confirmed || slotLevel == 0){
    return;
}

chosenSpellSlot = getSpellSlots(actor, slotLevel);
let objUpdate = new Object();
objUpdate['system.spells.spell' + slotLevel + '.value'] = chosenSpellSlot.value + 1;
actor.update(objUpdate);

function getSpellSlots(actor, level) {
    return actor.system.spells[`spell${level}`];
}