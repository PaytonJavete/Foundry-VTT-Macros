const lastArg = args[args.length-1];

actor = await fromUuid(lastArg.actorUuid);
choices = [];
maxSpellLevels = Math.ceil(actor.system.details.level / 2);

// Get options for missing spell slots, and spell level 5 or less
let optionsText = "<option value='0'>None</option>";
for (i = 1; i <= 5; i++) {
    const slots = actor.system.spells[`spell${i}`];
    if (slots.max > 0 && slots.max != slots.value) {
        const level = CONFIG.DND5E.spellLevels[i];
        const label = game.i18n.format('DND5E.SpellLevelSlot', {level: level, n: `${slots.value}/${slots.max}`});
        optionsText += `<option value="${i}">${label}</option>`;
    }
}

let dialog = new Promise(async (resolve, reject) => {
    new Dialog({
        title: "Arcane Recovery",
        content: `
        <form id="AR-use-form" name="Arcane Recovery Dialog Window">
            <p>The spells restored must have a combined level of `+ maxSpellLevels +` or less.</p>
            <div id="wrapper-AR">
                <div id="spell-form-AR" class="form-group">
                    <label>Restore Spell</label>
                    <div class="form-fields">
                        <select name="spell-level">` + optionsText + `</select>
                    </div>
                </div>
            </div>
        </form>

        <button id="addSpellButton" style="font-size:20px">(<i class="fa fa-plus"></i>)Add Spell</button>

        <script>
            $(function(){
                $("#addSpellButton").click(function() {
                    $("#spell-form-AR").clone().appendTo("#wrapper-AR");
                }); 
            }); 
        </script>
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
            choices = html.find('[name="spell-level"]').get();
        }
    }).render(true);
});
confirmed = await dialog;

if(!confirmed){
    return;
}

spellLevels = choices.map((spell) => parseInt(spell.value))
const sum = spellLevels.reduce((partialSum, a) => partialSum + a, 0);
if (sum > maxSpellLevels){
    ui.notifications.warn("Restored too many spell slots using Arcane Recovery");
    return;
}

let objUpdate = new Object();
for (i = 1; i <= 5; i++){
    chosenSpellSlots = actor.system.spells[`spell${i}`];
    value = chosenSpellSlots.value + spellLevels.filter(x => x==i).length;
    if (value > chosenSpellSlots.max){
        ui.notifications.warn(`Restored too many level ${i} spell slots using Arcane Recovery`);
        return;
    }
    objUpdate['system.spells.spell' + i + '.value'] = value;
}
actor.update(objUpdate)