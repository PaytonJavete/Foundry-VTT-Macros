const lastArg = args[args.length-1];
const itemT = lastArg.actor.items.getName("Greatsword, +3");

const weapon = new CONFIG.Item.documentClass(itemT, { parent: lastArg.actor });
const options = { showFullCard: false, createWorkflow: true, configureDialog: false };
await MidiQOL.completeItemRoll(weapon, options);