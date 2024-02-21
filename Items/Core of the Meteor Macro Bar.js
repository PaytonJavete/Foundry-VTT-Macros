const item = actor.items.getName("Core of the Meteor");
const workflowItemData = duplicate(item);
let numdice = 3 * (actor.system.resources.tertiary.max - actor.system.resources.tertiary.value);
workflowItemData.system.uses = {max: null, per: "", value: null};
workflowItemData.system.damage.parts[0][0] = `${numdice}d6[bludgeoning]`;
workflowItemData.system.damage.parts[1][0] = `${numdice}d6[fire]`;

const spellItem = new CONFIG.Item.documentClass(workflowItemData, { parent: actor });
const options = { showFullCard: false, createWorkflow: true, configureDialog: true };
const result = await MidiQOL.completeItemRoll(spellItem, options);  