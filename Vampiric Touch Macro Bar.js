let concentrating = actor.effects.find(effect => effect.sourceName == "Vampiric Touch" && effect.label == "Concentrating");
if(concentrating == undefined){
    game.dnd5e.macros.rollItem("Vampiric Touch");
} else {
    const item = actor.items.getName("Vampiric Touch");
    const damage = DAE.getFlag(actor, "VampiricTouchDamage");
    const workflowItemData = duplicate(item);
    workflowItemData.system.components.concentration = false;
    workflowItemData.system.preparation.mode = "atwill";
    workflowItemData.system.uses = {max: null, per: "", value: null};
    workflowItemData.system.duration = { value: null, units: "inst" };
    workflowItemData.system.damage.parts[0][0] = damage;

    const spellItem = new CONFIG.Item.documentClass(workflowItemData, { parent: actor });
    const options = { showFullCard: false, createWorkflow: true, configureDialog: true };
    const result = await MidiQOL.completeItemRoll(spellItem, options);
}