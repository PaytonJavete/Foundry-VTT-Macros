let concentrating = actor.effects.some(effect => effect.name == "Concentrating: Heat Metal");
if(!concentrating){
    dnd5e.documents.macro.rollItem("Heat Metal");
} else {
    const item = actor.items.getName("Heat Metal");
    const damage = DAE.getFlag(actor, "HeatMetalDamage");
    const workflowItemData = foundry.utils.duplicate(item);
    workflowItemData.system.properties = [];
    workflowItemData.system.preparation.mode = "atwill";
    workflowItemData.system.uses = {max: null, per: "", value: null};
    workflowItemData.system.duration = { value: null, units: "inst" };
    workflowItemData.system.damage.parts[0][0] = damage;
    workflowItemData.system.activation.type = "bonus";

    const spellItem = new CONFIG.Item.documentClass(workflowItemData, { parent: actor });
    const options = { showFullCard: false, createWorkflow: true, configureDialog: true };
    const result = await MidiQOL.completeItemUse(spellItem, options);  
}