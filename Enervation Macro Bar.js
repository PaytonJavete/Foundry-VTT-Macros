let concentrating = actor.effects.find(effect => effect.sourceName == "Enervation" && effect.label == "Concentrating");
if(concentrating == undefined){
    game.dnd5e.macros.rollItem("Enervation");
} else {
    const item = actor.items.getName("Enervation");
    const damage = DAE.getFlag(actor, "EnervationDamage");
    const workflowItemData = duplicate(item);
    workflowItemData.system.components.concentration = false;
    workflowItemData.system.preparation.mode = "atwill";
    workflowItemData.system.uses = {max: null, per: "", value: null};
    workflowItemData.system.duration = { value: null, units: "inst" };
    workflowItemData.system.damage.parts[0][0] = damage;
    workflowItemData.system.actionType = "other";
    workflowItemData.system.save = {ability: "", dc: null, scaling: "spell"};
    setProperty(workflowItemData, "effects", []);

    const spellItem = new CONFIG.Item.documentClass(workflowItemData, { parent: actor });
    const options = { showFullCard: false, createWorkflow: true, configureDialog: true };
    const result = await MidiQOL.completeItemRoll(spellItem, options);
}