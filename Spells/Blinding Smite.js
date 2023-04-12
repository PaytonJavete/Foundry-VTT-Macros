const lastArg = args[args.length -1];
let isCaster = lastArg.origin.includes(lastArg.actorUuid);
if(args[0]=== "off" && lastArg["expiry-reason"] == "midi-qol:1Action,1Attack,1Hit,1Spell" && isCaster) {
    messages = Array.from(game.messages);
    let workflowId = null;
    for (var i = messages.length - 1; i >= 0; i--) {
        content = messages[i].data.content;
        if (content.includes(`<div class="midi-qol-attack-roll">`) && content.includes(`${lastArg.tokenId}`)){
            workflowId = messages[i].data.flags["midi-qol"].workflowId;
            break;
        }
    }
    const workflow = await MidiQOL.Workflow.getWorkflow(workflowId);

    const damagedTarget = workflow.damageList[0];   
    const actor = canvas.tokens.get(lastArg.tokenId).actor;
    const targetActor = canvas.tokens.get(damagedTarget.tokenId).actor;
    const spellDC = actor.system.attributes.spelldc;
    const saveType = "con";

    let save_roll = await targetActor.rollAbilitySave(saveType, {chatMessage : true, async: true });
    if (save_roll.total < spellDC){
        const effectData = lastArg.efData;
        effectData.changes.pop();
        effectData.changes.pop();
        effectData.changes.push({key:"flags.midi-qol.OverTime", mode: 0, priority: 20, value: `label=Blinding Smite, 
            turn=end, 
            saveAbility=${saveType}, 
            saveDC=${spellDC}, 
            saveMagic=true, 
            saveRemove=true`});
        effectData.changes.push({key: "macro.CE", mode: 0, priority: 20, value: "Blinded"})
        effectData.flags.dae.specialDuration = [];
        await targetActor.createEmbeddedDocuments('ActiveEffect', [effectData]);
        
        //need to set new concentration data as well
        let flag = await actor.getFlag("midi-qol", "concentration-data");
        flag.targets.push({actorUuid: damagedTarget.actorUuid, tokenUuid: damagedTarget.tokenUuid});
        await actor.setFlag("midi-qol", "concentration-data", flag);
    }
}