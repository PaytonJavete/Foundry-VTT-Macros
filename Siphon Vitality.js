async function wait(ms) { return new Promise(resolve => { setTimeout(resolve, ms); }); }
const lastArg = args[args.length - 1];
const actor = lastArg.actor;
const item = lastArg.item;
const itemUuid = await fromUuid(lastArg.uuid);

//Assumes that this ability is used when last time was damage dealt by user
messages = Array.from(game.messages);
let workflowId = null;
for (var i = messages.length - 1; i >= 0; i--) {
    content = messages[i].data.content;
    if (messages[i].data?.flags["midi-qol"]?.workflowId && messages[i].data.speaker.actor == actor.id && messages[i].data.flavor != "Siphon Vitality"){
        workflowId = messages[i].data.flags["midi-qol"].workflowId;
        break;
    }
}
let workflow = MidiQOL.Workflow.getWorkflow(workflowId);
console.log(workflow);
let healingPool = 0;
for (entry of workflow.damageList){
    if (entry.appliedDamage > healingPool){
        healingPool = entry.appliedDamage;
    }
}
if (healingPool == 0){
    return ui.notifications.error()
}

// Create workflow item
const workflowItemData = duplicate(item);
setProperty(workflowItemData, "flags.itemacro", {});
setProperty(workflowItemData, "flags.midi-qol", {});
setProperty(workflowItemData, "flags.dae", {});
setProperty(workflowItemData, "effects", []);
delete workflowItemData._id;
const options = { showFullCard: true, createWorkflow: true, versatile: false, configureDialog: false };

//Remove targets with full HP, and put valid targets in new array
let invalidTargets = 0;
let validTargets = [];
for (let target of lastArg.targets){
    if (target.disposition == -1){
        return ui.notifications.error("Cannot heal hostile creatures with this ability! (Reveals HP info)");
    }
    targetHPDiff = target.actor.system.attributes.hp.max - target.actor.system.attributes.hp.value;
    if (targetHPDiff <= 0){
        invalidTargets += 1;
    } else {
        validTargets.push(target);
    }
}
if (invalidTargets > 0){
    ui.notifications.warn(`There were ${invalidTargets} targets with HP greater than or equal to their maximum HP. Targets removed from list.`);
}

if (validTargets.length === 1) {
    await anime(canvas.tokens.get(validTargets[0].id));
    game.user.updateTokenTargets([validTargets[0].id]);
    workflowItemData.system.damage.parts[0] = [`${healingPool}[healing]`, "healing"];
    spellItem = new CONFIG.Item.documentClass(workflowItemData, { parent: actor });
    await MidiQOL.completeItemRoll(spellItem, options);
} else if (validTargets.length > 1) {
    let targetList = validTargets.reduce((list, target) => { return list + `<tr><td>${target.name} (HP: ${target.actor.system.attributes.hp.value}/${target.actor.system.attributes.hp.max})</td><td><input type="num" id="target" min="0" max="${healingPool}" name="${target.id}"></td></tr>` }, "");
    let the_content = `<p>You have currently <b>${healingPool}</b> total ${item.name} points of healing.</p><form class="flexcol"><table width="100%"><tbody><tr><th>Target</th><th>Healing Points</th></tr>${targetList}</tbody></table></form>`;
    let dialog = new Promise(async (resolve, reject) => {
        let errorMessage;
        new Dialog({
            title: `${item.name} Healing`,
            content: the_content,
            buttons: {
                heal: {
                    label: "Heal", callback: async (html) => {
                        let spentTotal = 0;
                        let selected_targets = html.find('input#target');
                        for (let get_total of selected_targets) {
                            spentTotal += Number(get_total.value);
                        }
                        if (spentTotal > healingPool) {
                            errorMessage = `The ability fails, You assigned more healing than you have.`;
                            return ui.notifications.error(errorMessage);
                        }
                        if (spentTotal === 0) {
                            errorMessage = `The ability fails, No healing spent.`;
                            return ui.notifications.error(errorMessage);
                        }
                        for (let selected_target of selected_targets) {
                            totalHeal = selected_target.value;
                            if (totalHeal > 0) {
                                let target_id = selected_target.name;
                                await anime(canvas.tokens.get(target_id));
                                game.user.updateTokenTargets([target_id]);
                                workflowItemData.system.damage.parts[0] = [`${totalHeal}[healing]`, "healing"];
                                spellItem = new CONFIG.Item.documentClass(workflowItemData, { parent: actor });
                                await MidiQOL.completeItemRoll(spellItem, options);
                                await wait(500);
                            }
                        }
                    }
                }
            },
            close: async (html) => {
                if(errorMessage) reject(new Error(errorMessage));
            },
            default: "damage"
        }).render(true);
    });
    await dialog;
}

async function anime(target) {
    new Sequence()
        .effect()
        .file("jb2a.healing_generic.200px.red")
        .atLocation(target)
    .play()
}