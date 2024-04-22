let concentrating = actor.effects.some(effect => effect.sourceName == "Heat Metal" && effect.label == "Concentrating");
if(!concentrating){
    dnd5e.documents.macro.rollItem("Heat Metal");
} else {
    const item = actor.items.getName("Heat Metal");
    const damage = DAE.getFlag(actor, "HeatMetalDamage");
    const workflowItemData = duplicate(item);
    workflowItemData.system.components.concentration = false;
    workflowItemData.system.preparation.mode = "atwill";
    workflowItemData.system.uses = {max: null, per: "", value: null};
    workflowItemData.system.duration = { value: null, units: "inst" };
    workflowItemData.system.damage.parts[0][0] = damage;
    workflowItemData.system.activation.type = "bonus";

    const spellItem = new CONFIG.Item.documentClass(workflowItemData, { parent: actor });
    const options = { showFullCard: false, createWorkflow: true, configureDialog: true };
    const result = await MidiQOL.completeItemRoll(spellItem, options);  
}