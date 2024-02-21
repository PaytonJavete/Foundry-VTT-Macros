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
    const uuid = target.actor.uuid;
    const t_actor = await fromUuid(uuid);
    let DC = workflow.actor.system.attributes.spelldc;
    let save = await t_actor.rollAbilitySave("wis");
    if(save.total < DC) await game.dfreds.effectInterface.addEffect({ effectName: 'Staggering Smite', uuid });
}