let concentrating = actor.effects.some(effect => effect.sourceName == "Storm Sphere" && effect.label == "Concentrating");
if(!concentrating){
    game.dnd5e.macros.rollItem("Storm Sphere")    
} else {
	if (game.user.targets.size != 1){
    	return ui.notifications.warn("Storm Sphere Bolt must target one creature.");
    }

    const template = canvas.scene.templates.find(template => template.flags["Storm Sphere"].id == actor.id);
    let spellLevel = template.flags["Storm Sphere"].spellLevel;
    let stormX = template.x;
    let stormY = template.y;
    let stormCenter = canvas.grid.getCenter(stormX, stormY);

    const [target] = game.user.targets;
    let targetCenter = canvas.grid.getCenter(target.x, target.y);

    if (canvas.grid.measureDistance({ x: stormCenter[0], y: stormCenter[1] }, { x: targetCenter[0], y: targetCenter[1] }, { gridSpaces: true }) > 60){
    	return ui.notifications.warn("Target is more than 60 feet from the center of the storm sphere.")
    }

    let targetActor = target.actor;
    let inStorm = targetActor.effects.some(effect => effect.sourceName == "Storm Sphere" && effect.label == "Storm Sphere");
    if (inStorm){
    	uuid = targetActor.uuid;
 		await game.dfreds.effectInterface.addEffect({ effectName: 'Storm Sphere Advantage Helper', uuid });   	
    }
    
    const item = actor.items.getName("Storm Sphere");
    const workflowItemData = duplicate(item);
    workflowItemData.system.components.concentration = false;
    workflowItemData.system.preparation.mode = "atwill";
    workflowItemData.system.uses = {max: null, per: "", value: null};
    workflowItemData.system.damage.parts = [[`${spellLevel}d6[lightning]`, "lightning"]];
    workflowItemData.system.range = {long: null, units: "", value: null};
    workflowItemData.system.target = {type: "creature", units: "", value: 1, width: null};
    workflowItemData.system.actionType = "rsak";
    workflowItemData.system.activation = {type: 'bonus', cost: 1, condition: ''};
    workflowItemData.system.save = {ability: '', dc: null, scaling: 'spell'};
    workflowItemData.system.duration = {value: null, units: ''};
    workflowItemData.system.chatFlavor = "";
    setProperty(workflowItemData, "name", "Storm Sphere Bolt");
    setProperty(workflowItemData, "img", "icons/magic/lightning/bolt-strike-blue.webp");
    setProperty(workflowItemData, "flags.itemacro", {});
	setProperty(workflowItemData, "flags.midi-qol", {});
	setProperty(workflowItemData, "flags.dae", {});
	setProperty(workflowItemData, "effects", []);

    const spellItem = new CONFIG.Item.documentClass(workflowItemData, { parent: canvas.tokens.controlled[0].actor });
    const options = { showFullCard: false, createWorkflow: true, configureDialog: true};
    const result = await MidiQOL.completeItemRoll(spellItem, options);

    playStormBolt(template, target, result.hitTargets.size == 0);
}

function playStormBolt(template, token, result){
	new Sequence()
    .effect()
      .file("jb2a.chain_lightning.primary.purple")
      .atLocation(template)
      .stretchTo(token)
      .missed(result)
    .play();
}