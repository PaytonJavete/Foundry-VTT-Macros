const tokenS = canvas.tokens.get(args[0].tokenId);
const actorS = tokenS.actor;
const itemS = actorS.items.getName("Fire Storm");
const workflowItemData = duplicate(itemS);
workflowItemData.system.preparation.mode = "atwill";
workflowItemData.system.uses = {max: null, per: "", value: null};
setProperty(workflowItemData, "flags.itemacro", {});

const spellItem = new CONFIG.Item.documentClass(workflowItemData, { parent: actorS });
const options = { showFullCard: false, createWorkflow: true, configureDialog: true };

for (let i = 0; i < 9; i++){
    await MidiQOL.completeItemRoll(spellItem, options);  
}

for (template of canvas.templates.placeables){
    if (template.document.flags["midi-qol"].originUuid == item.uuid) template.document.delete();
}