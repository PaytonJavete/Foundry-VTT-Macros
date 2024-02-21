const weapons = actor.items.filter((i) => i.type === "weapon");

const weaponContent = weapons.map((w) => `<option value=${w.id}>${w.name}</option>`).join("");

let itemId = null;

const content = `
    <div class="form-group">
     <label>Weapons : </label>
     <select name="weapons">
     ${weaponContent}
     </select>
    </div>
`;

let confirmed = false;

let dialog = new Promise(async (resolve, reject) => {
    new Dialog({
    title: "Choose a weapon to strike with.",
    content,
    buttons: {
        one: {
            icon: '<i class="fas fa-check"></i>',
            label: "Strike!",
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
        itemId = html.find("[name=weapons]")[0].value;
    }
  }).render(true);
});
confirmed = await dialog;

if (itemId == null) return ui.notifications.error("Error with selected weapon!");

if (!confirmed) return;

const weaponItem = actor.getEmbeddedDocument("Item", itemId);
const weaponCopy = duplicate(weaponItem);

weaponCopy.name = "Gravity Slash";
weaponCopy.system.target = {value: 30, width: 5, units: 'ft', type: 'line'};
weaponCopy.system.range.value = self;

const spellItem = new CONFIG.Item.documentClass(weaponCopy, { parent: actor });
const options = { showFullCard: false, createWorkflow: true, configureDialog: true };
const result = await MidiQOL.completeItemRoll(spellItem, {}, options);

// for (target in result.targets)
//     let save_roll = await target.actor.rollAbilitySave("str", {chatMessage : true, async: true });
//     let spellDC = 15;
//     let targetUuid = target.uuid
//     if (save_roll.total < spellDC){
//         const hasEffectApplied = await game.dfreds.effectInterface.hasEffectApplied('Prone', targetUuid);
//         if (!hasEffectApplied) {
//           game.dfreds.effectInterface.addEffect({ effectName: 'Prone', uuid: targetUuid });
//         }
//     }
// }