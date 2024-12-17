async function wait(ms) { return new Promise(resolve => { setTimeout(resolve, ms); }); }
const lastArg = args[args.length -1];
let isCaster = lastArg.origin.includes(lastArg.actorUuid);
if(args[0]=== "off" && lastArg["expiry-reason"] == "midi-qol:1Hit" && isCaster) {
    messages = Array.from(game.messages);
    let workflowId = null;
    for (var i = messages.length - 1; i >= 0; i--) {
        message = messages[i];
        if (hasProperty(message, "flags.midi-qol.d20AttackRoll")){
            workflowId = message.flags["midi-qol"].workflowId;
            break;
        }
    }

    const workflow = MidiQOL.Workflow.getWorkflow(workflowId);
    //wait a moment to make sure we have workflow var before continuing
    await wait(500);

    const damagedTarget = workflow.damageList[0];
    const effectData = lastArg.efData;
    const actor = canvas.tokens.get(lastArg.tokenId).actor;
    const targetActor = canvas.tokens.get(damagedTarget.tokenId).actor;

    effectData.changes.pop();
    effectData.changes.push({key:"ATL.light.dim", mode: 2, priority: 20, value: "5"});
    effectData.flags.dae.specialDuration = [];
    let [effect] = await targetActor.createEmbeddedDocuments('ActiveEffect', [effectData]);
    
    //need to set new concentration data as well
    await actor.effects.find(e => e.name.includes("Concentrating")).update({"flags.dnd5e.dependents": [{uuid: `${effect.uuid}`}]});

} else if (args[0]=== "on" && !isCaster){
    await DAE.setTokenVisibility(lastArg.tokenUuid, true)
}