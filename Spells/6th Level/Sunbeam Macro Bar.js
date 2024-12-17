let concentrating = actor.effects.some(effect => effect.name == "Concentrating: Sunbeam");
if(!concentrating){
    dnd5e.documents.macro.rollItem("Sunbeam");
} else {
    const item = actor.items.getName("Sunbeam");
    const workflowItemData = duplicate(item);
    workflowItemData.system.properties = [];
    workflowItemData.system.preparation.mode = "atwill";
    workflowItemData.system.uses = {max: null, per: "", value: null};
    workflowItemData.system.duration = { value: null, units: "inst" };
    blindEffect = workflowItemData.effects.find(effect => effect.name == "Sunbeam Blind");
    foundry.utils.setProperty(workflowItemData, "effects", [blindEffect]);

    const spellItem = new CONFIG.Item.documentClass(workflowItemData, { parent: actor });
    const options = { showFullCard: false, createWorkflow: true, configureDialog: true };
    const result = await MidiQOL.completeItemUse(spellItem, options);  
}