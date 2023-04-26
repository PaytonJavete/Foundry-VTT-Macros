const item = actor.items.getName("Dragon's Breath");
const workflowItemData = duplicate(item);

let type = null;
let confirmed = false;

let dialog = new Promise((resolve, reject) => {
    new Dialog({
        title: 'Choose a Dragon Breath Damage Type',
        content: `
          <form class="flexcol">
            <div class="form-group">
              <select id="type">
                <option value="acid">Acid</option>
                <option value="cold">Cold</option>
                <option value="fire">Fire</option>
                <option value="lightning">Lightning</option>
                <option value="poison">Posion</option>
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
                    resolve(true);
                },
            },
        }
    }).render(true);
})
confirmed = await dialog;
if (!confirmed) return;

console.log(workflowItemData);
const effectData = workflowItemData.effects.find(effect => effect.label == "Dragon's Breath");
effectData.changes[0].value = `@item.level ${type}`;
setProperty(workflowItemData, "effects", [effectData]);

const spellItem = new CONFIG.Item.documentClass(workflowItemData, { parent: actor });
const options = { showFullCard: true, createWorkflow: true, configureDialog: true };
await MidiQOL.completeItemRoll(spellItem, options);