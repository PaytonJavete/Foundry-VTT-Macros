async function wait(ms) { return new Promise(resolve => { setTimeout(resolve, ms); }); }
const lastArg = args[args.length -1];
if(args[0] === "off" && lastArg["expiry-reason"].includes("1Hit")){
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

    const [target] = workflow.targets;
    const effectData = lastArg.efData;
    const caster = canvas.tokens.get(lastArg.tokenId).actor;
    const t_actor = await fromUuid(target.actor.uuid);
    const DC = caster.system.attributes.spelldc

    effectData.changes = [];
    effectData.changes[0] = {
        "key": "flags.midi-qol.OverTime",
        "value": `turn=start, saveAbility=con, saveDC=${DC}, saveDamage=nodamage, rollType=save, saveMagic=true, damageBeforeSave=false, damageRoll=1d6, damageType=fire, saveRemove=true`,
        "mode": 0,
        "priority": 20
    };
    effectData.flags.dae.specialDuration = [];
    await t_actor.createEmbeddedDocuments('ActiveEffect', [effectData]);
    
    //need to set new concentration data as well      
    let flag = await caster.getFlag("midi-qol", "concentration-data");
    flag.targets.push({actorUuid: t_actor.uuid, tokenUuid: target.uuid});
    await caster.setFlag("midi-qol", "concentration-data", flag);
}