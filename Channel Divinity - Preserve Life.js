// Item macro, Midi-qol On Use. This handles damage, so remove it from the spell card. This macro is for RAW damage, not RAI.
async function wait(ms) { return new Promise(resolve => { setTimeout(resolve, ms); }); }
const lastArg = args[args.length - 1];
const actor = lastArg.actor;
const item = lastArg.item;
const healingPool = 5 * actor.system.details.level
const itemUuid = await fromUuid(lastArg.uuid);
const damageType = "healing";
let heal_target = [];
let heal_result = [];
let totalHeal;

//Remove targets with greater than or equal half HP, and put valid targets in new array
let invalidTargets = 0;
let validTargets = [];
for (let target of lastArg.targets){
    if (target.disposition == -1){
        return ui.notifications.error("Cannot heal hostile creatures with this ability! (Reveals HP info)");
    }
    targetHPDiff = Math.floor(target.actor.system.attributes.hp.max / 2) - target.actor.system.attributes.hp.value;
    if (targetHPDiff <= 0){
        invalidTargets += 1;
    } else {
        validTargets.push(target);
    }
}
if (invalidTargets > 0){
    ui.notifications.warn(`There were ${invalidTargets} targets with HP greater than or equal to half of their maximum HP. Targets removed from list.`);
}

if (validTargets.length === 1) {
    let target = canvas.tokens.get(validTargets[0].id);
    targetHPDiff = Math.floor(target.actor.system.attributes.hp.max / 2) - target.actor.system.attributes.hp.value;
    totalHeal = targetHPDiff > healingPool ? healingPool : targetHPDiff;
    await anime(target);
    await MidiQOL.applyTokenDamage([{ damage: totalHeal, type: damageType }], totalHeal, new Set([target]), itemUuid, new Set());
    heal_target.push(`<div class="midi-qol-flex-container"><div>hits</div><div class="midi-qol-target-npc midi-qol-target-name" id="${target.id}"> ${target.name}</div><div><img src="${target.document.texture.src}" width="30" height="30" style="border:0px"></div></div>`);
    heal_result.push(`<div style="text-align:center">(Healing)</div><div class="dice-roll"><div class="dice-result"><div class="dice-formula">${totalHeal}</div><div class="dice-tooltip"><section class="tooltip-part"><div class="dice"><header class="part-header flexrow"><span class="part-formula">${totalHeal}</span><span class="part-total">${totalHeal}</span></header><ol class="dice-rolls"><li class="healing applied ${totalHeal}">${totalHeal}</li></ol></div></section></div><h4 class="dice-total">${totalHeal}</h4></div></div>`);
    await hitList();
    await rollList();
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
                                let get_target = canvas.tokens.get(target_id);
                                targetHPDiff = Math.floor(get_target.actor.system.attributes.hp.max / 2) - get_target.actor.system.attributes.hp.value;
                                if (targetHPDiff < totalHeal){
                                    overheal = totalHeal - targetHPDiff;
                                    errorMessage = `Overhealed ${get_target.name} by ${overheal}. Setting heal amount to ${targetHPDiff}`;
                                    ui.notifications.warn(errorMessage);
                                    totalHeal = targetHPDiff;
                                }
                                await anime(get_target);
                                await MidiQOL.applyTokenDamage([{ damage: totalHeal, type: damageType }], totalHeal, new Set([get_target]), itemUuid, new Set());
                                heal_target.push(`<div class="midi-qol-flex-container"><div>hits</div><div class="midi-qol-target-npc midi-qol-target-name" id="${get_target.id}"> ${get_target.name} [${totalHeal}]</div><div><img src="${get_target.document.texture.src}" width="30" height="30" style="border:0px"></div></div>`);

                            }
                        }
                        heal_result.push(`<div style="text-align:center">(Healing)</div><div class="dice-roll"><div class="dice-result"><div class="dice-formula">${totalHeal}</div><div class="dice-tooltip"><section class="tooltip-part"><div class="dice"><header class="part-header flexrow"><span class="part-formula">${totalHeal}</span><span class="part-total">${totalHeal}</span></header><ol class="dice-rolls"><li class="healing applied ${totalHeal}">${totalHeal}</li></ol></div></section></div><h4 class="dice-total">${totalHeal}</h4></div></div>`);
                        await hitList();
                        await rollList();
                        resolve();
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

async function hitList() {
    let heal_list = heal_target.join('');
    let heal_results = `<div><div class="midi-qol-nobox">${heal_list}</div></div>`;
    let chatMessage = await game.messages.get(lastArg.itemCardId);
    let content = await duplicate(chatMessage.content);
    let searchString = /<div class="midi-qol-hits-display">[\s\S]*<div class="end-midi-qol-hits-display">/g;
    let replaceString = `<div class="midi-qol-hits-display"><div class="end-midi-qol-hits-display">${heal_results}`;
    content = await content.replace(searchString, replaceString);
    return chatMessage.update({ content: content });
}

async function rollList() {
    let heal_results = heal_result.join('');
    let chatMessage = await game.messages.get(lastArg.itemCardId);
    let content = await duplicate(chatMessage.content);
    let searchString = /<div class="midi-qol-other-roll">[\s\S]*<div class="end-midi-qol-other-roll">/g;
    let replaceString = `<div class="midi-qol-other-roll"><div class="end-midi-qol-other-roll">${heal_results}`;
    content = await content.replace(searchString, replaceString);
    return chatMessage.update({ content: content });
}

async function anime(target) {
    new Sequence()
        .effect()
        .file("modules/jb2a_patreon/Library/Generic/Healing/HealingAbility_01_Yellow_400x400.webm")
        .atLocation(target)
    .play()
}