let confirmed = true;
let height = 0;
let dialog = new Promise(async (resolve, reject) => {
    new Dialog({
        title: "Boots of the Meteor",
        content:`
        <form id="damage-form">
            <p>Slam Height?</p>
            <div class="form-group">
                <input type="text" name="height">
            </div>
        </form>
        `,
        buttons: {
            one: {
                icon: '<i class="fas fa-check"></i>',
                label: "Activate",
                callback: () => resolve(true)
            },
            two: {
                icon: '<i class="fa-solid fa-circle-exclamation"></i>',
                label: "Slam",
                callback: () => {resolve(false)}
            }
        },
        default: "Activate",
        close: html => {
            height = parseInt(html.find('[name=height]')[0].value);
        }
    }).render(true);
});
confirmed = await dialog;

if (confirmed) return dnd5e.documents.macro.rollItem("Boots of the Meteor (Awakened)");

if (!Number.isInteger(height)) return ui.notifications.warn("Height must be an integer.");;

if (height < 10) return ui.notifications.warn("Not enough height to slam.");

// New height set
let new_height = token.document.elevation - height;
token.document.update({elevation: new_height})

//Get number of dice
let damageDice = Math.floor(height/10);
if (damageDice > 20) damageDice = 20;

const item = actor.items.getName("Boots of the Meteor (Awakened)");
const workflowItemData = duplicate(item);
workflowItemData.name = "Gravity Slam";
workflowItemData.system.uses = {max: null, per: "", value: null};
workflowItemData.system.duration = { value: null, units: "inst" };
workflowItemData.system.actionType = "save";
workflowItemData.system.save = {ability: 'dex', dc: 15, scaling: 'flat'};
workflowItemData.system.target = {value: 10, units: 'ft', type: 'enemy'};
workflowItemData.system.damage.parts[0] = [`${damageDice}d6[force]`, 'force'];
setProperty(workflowItemData, "effects", []);

const spellItem = new CONFIG.Item.documentClass(workflowItemData, { parent: actor });
const options = { showFullCard: false, createWorkflow: true, configureDialog: true };
const result = await MidiQOL.completeItemRoll(spellItem, {}, options);

let selfDamage = Math.floor(result.damageTotal / 2);

await MidiQOL.applyTokenDamage([{ damage: selfDamage, type: 'bludgeoning' }], selfDamage, new Set([token]), workflowItemData.uuid, new Set());