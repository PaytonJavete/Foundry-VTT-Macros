const actor = canvas.tokens.controlled[0].actor;
const item = actor.items.getName("Breath Weapon");
const workflowItemData = duplicate(item);

let type = null;
let confirmed = false;

let dialog = new Promise((resolve, reject) => {
    new Dialog({
        title: 'Choose a Damage Type for SDS Breath Weapon',
        content: `
          <form class="flexcol">
            <div class="form-group">
              <select id="type">
                <option value="acid">Acid</option>
                <option value="cold">Cold</option>
                <option value="fire">Fire</option>
                <option value="force">Force (Gem Only)</option>
                <option value="lightning">Lightning</option>
                <option value="necrotic">Necrotic (Gem Only)</option>
                <option value="poison">Posion</option>
                <option value="psychic">Psychic (Gem Only)</option>
                <option value="radiant">Radiant (Gem Only)</option>
                <option value="thunder">Thunder (Gem Only)</option>
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

workflowItemData.name = "SDS Breath Weapon";
workflowItemData.system.damage.parts[0][1] = type;

const spellItem = new CONFIG.Item.documentClass(workflowItemData, { parent: actor });
const options = { showFullCard: false, createWorkflow: true, configureDialog: true };
await MidiQOL.completeItemRoll(spellItem, options);  