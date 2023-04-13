const token = canvas.tokens.get(args[0].tokenId);
const actor = token.actor;
const item = actor.items.getName("Fire Storm");
const workflowItemData = duplicate(item);
workflowItemData.system.preparation.mode = "atwill";
workflowItemData.system.uses = {max: null, per: "", value: null};
setProperty(workflowItemData, "flags.itemacro", {});

const spellItem = new CONFIG.Item.documentClass(workflowItemData, { parent: actor });
const options = { showFullCard: false, createWorkflow: true, configureDialog: true };

for (let i = 0; i < 9; i++){
    await MidiQOL.completeItemRoll(spellItem, options);  
}

for (template of canvas.templates.placeables){
    if (template.document.flags["midi-qol"].originUuid == item.uuid) template.document.delete();
}