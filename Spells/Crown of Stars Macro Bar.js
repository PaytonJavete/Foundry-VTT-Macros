let active = actor.effects.some(effect => effect.sourceName == "Crown of Stars");
if(!active){
    dnd5e.documents.macro.rollItem("Crown of Stars");
} else {
    const item = actor.items.getName("Crown of Stars");
    let stars = DAE.getFlag(actor, "CrownofStars");
    const workflowItemData = duplicate(item);
    workflowItemData.system.preparation.mode = "atwill";
    workflowItemData.system.uses = {max: null, per: "", value: null};
    workflowItemData.system.duration = { value: null, units: "inst" };
    workflowItemData.system.actionType = "rsak";
    workflowItemData.system.activation.type = "bonus";
    workflowItemData.system.damage.parts[0] = ["4d12[radiant]", "radiant"];
    workflowItemData.system.range = {long: null, units: "ft", value: 120};
    workflowItemData.system.target = {type: "creature", value: 1, prompt: false, units: ""};
    workflowItemData.system.attackBonus = `${actor.system.attributes.prof}`;
    workflowItemData.system.chatFlavor = `${stars-1} stars remaining`;
    setProperty(workflowItemData, "flags.itemacro", {});
    setProperty(workflowItemData, "effects", []);

    const spellItem = new CONFIG.Item.documentClass(workflowItemData, { parent: actor });
    const options = { showFullCard: false, createWorkflow: true, configureDialog: true };
    const result = await MidiQOL.completeItemRoll(spellItem, options);

    if (result){
        stars -= 1;
        let effect = actor.effects.find(effect => effect.sourceName == "Crown of Stars");
        if (stars <= 0) effect.delete();
        else if (stars <= 3) effect.update({changes: [{
            "key": "ATL.light.dim",
            "value": "30",
            "mode": 4,
            "priority": 20
        }]});
        if (stars > 0) effect.update({label: `Crown of Stars Effect - ${stars}`});
        DAE.setFlag(actor, "CrownofStars", stars);
    }
}