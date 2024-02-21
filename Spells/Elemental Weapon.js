const item = actor.items.getName("Elemental Weapon");
const workflowItemData = duplicate(item);

let type = null;
let bonus = 1;
let confirmed = false;

let dialog = new Promise((resolve, reject) => {
    new Dialog({
        title: 'Choose an Elemental Weapon Damage Type',
        content: `
          <form class="flexcol">
            <div class="form-group">
              <select id="type">
                <option value="acid">Acid</option>
                <option value="cold">Cold</option>
                <option value="fire">Fire</option>
                <option value="lightning">Lightning</option>
                <option value="thunder">Thunder</option>
              </select>
            </div>
          </form>
          <form class="flexcol">
            <div class="form-group">
              <select id="bonus">
                <option value="1">Level 3/4</option>
                <option value="2">Level 5/6</option>
                <option value="3">Level 7+</option>
              </select>
            </div>
          </form>
        `,
        buttons: {
            yes: {
                icon: '<i class="fas fa-bolt"></i>',
                label: 'Select',
                callback: async (html) => {
                    type = html.find('#type').val();
                    bonus = html.find('#bonus').val();
                    resolve(true);
                },
            },
        }
    }).render(true);
})
confirmed = await dialog;
if (!confirmed) return;

console.log(workflowItemData);
const effectData = workflowItemData.effects.find(effect => effect.name == "Elemental Weapon");
effectData.changes[0].value = `+${bonus}`;
effectData.changes[1].value = `+${bonus}d4[${type}]`;
setProperty(workflowItemData, "effects", [effectData]);

const spellItem = new CONFIG.Item.documentClass(workflowItemData, { parent: actor });
const options = { showFullCard: true, createWorkflow: true, configureDialog: true };
await MidiQOL.completeItemRoll(spellItem, options);