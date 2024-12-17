let concentrating = actor.effects.some(effect => effect.name == "Concentrating: Draconic Transformation");
if(!concentrating){
    dnd5e.documents.macro.rollItem("Draconic Transformation");
} else {
    const item = actor.items.getName("Draconic Transformation");
    const workflowItemData = duplicate(item);
    workflowItemData.system.preparation.mode = "atwill";
    workflowItemData.system.properties = [];
    workflowItemData.system.uses = {max: null, per: "", value: null};
    workflowItemData.system.duration = { value: null, units: "inst" };
    foundry.utils.setProperty(workflowItemData, "effects", []);

    const spellItem = new CONFIG.Item.documentClass(workflowItemData, { parent: actor });
    const options = { showFullCard: false, createWorkflow: true, configureDialog: true };
    const result = await MidiQOL.completeItemUse(spellItem, options);  
}