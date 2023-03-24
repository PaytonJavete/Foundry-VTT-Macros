async function wait(ms) { return new Promise(resolve => { setTimeout(resolve, ms); }); }
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
    const workflow = MidiQOL.Workflow.getWorkflow(workflowId);
    //wait a moment to make sure we have workflow var before continuing
    await wait(500);

    const damagedTarget = workflow.damageList[0];
    if(damagedTarget.newHP <= 50){
        const effectData = lastArg.efData;
        const actor = canvas.tokens.get(lastArg.tokenId).actor;
        const targetActor = canvas.tokens.get(damagedTarget.tokenId).actor;

        effectData.changes.pop();
        effectData.flags.dae.specialDuration = []; 
        await targetActor.createEmbeddedDocuments('ActiveEffect', [effectData]);
        
        //need to set new concentration data as well      
        let flag = await actor.getFlag("midi-qol", "concentration-data");
        flag.targets.push({actorUuid: damagedTarget.actorUuid, tokenUuid: damagedTarget.tokenUuid});
        await actor.setFlag("midi-qol", "concentration-data", flag);
    }
} else if (args[0]=== "on" && !isCaster){
    await DAE.setTokenVisibility(lastArg.tokenUuid, false)
    DAE.setFlag(lastArg.tokenUuid, "banishment", 1);
    ChatMessage.create({content: "Creature banished"});
} else if (args[0]=== "off" && !isCaster){
    DAE.setTokenVisibility(lastArg.tokenUuid, true)
    DAE.unsetFlag(lastArg.tokenUuid, 'banishment');
    ChatMessage.create({content: "Creature returned"});
}