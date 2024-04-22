// Item macro, Midi-qol On Use. This handles damage, so remove it from the spell card. This macro is for RAW damage, not RAI.
async function wait(ms) { return new Promise(resolve => { setTimeout(resolve, ms); }); }
const lastArg = args[args.length - 1];
const tokenD = canvas.tokens.get(lastArg.tokenId);
const actorD = tokenD.actor;
const itemD = lastArg.item;
const itemUuid = await fromUuid(lastArg.uuid);
const damageType = "force";
const level = 2 + Number(lastArg.spellLevel);
let damage_target = [];
let damage_result = [];
let damageRoll;
let totalDamage;

if (lastArg.targets.length === 1) {
    let target = canvas.tokens.get(lastArg.targets[0].id);
    damageRoll = new Roll(`1d4[${damageType}]+1`).evaluate({ async: false });
    totalDamage = new Roll(`${level} * ${damageRoll.total}`).evaluate({ async: false });
    await anime(tokenD, target, level);
    await game.dice3d?.showForRoll(damageRoll);
    await MidiQOL.applyTokenDamage([{ damage: totalDamage.total, type: damageType }], totalDamage.total, new Set([target]), itemUuid, new Set());
    damage_target.push(`<div class="midi-qol-flex-container"><div>hits</div><div class="midi-qol-target-npc midi-qol-target-name" id="${target.id}"> ${target.name}</div><div><img src="${target.document.texture.src}" width="30" height="30" style="border:0px"></div></div>`);
    damage_result.push(`<div style="text-align:center">(${CONFIG.DND5E.damageTypes[damageType]})</div><div class="dice-roll"><div class="dice-result"><div class="dice-formula">${damageRoll.formula} x ${level} </div><div class="dice-tooltip"><section class="tooltip-part"><div class="dice"><header class="part-header flexrow"><span class="part-formula">${damageRoll.formula}</span><span class="part-total">${damageRoll.total}</span></header><ol class="dice-rolls"><li class="roll die d${damageRoll.dice[0].faces}">${damageRoll.dice[0].total}</li></ol></div></section></div><h4 class="dice-total">${totalDamage.total}</h4></div></div>`);
    await hitList();
    await rollList();
} else if (lastArg.targets.length > 1) {
    let targetList = lastArg.targets.reduce((list, target) => { return list + `<tr><td>${target.name}</td><td><input type="num" id="target" min="0" max="${level}" name="${target.id}"></td></tr>` }, "");
    let the_content = `<p>You have currently <b>${level}</b> total ${itemD.name} bolts.</p><form class="flexcol"><table width="100%"><tbody><tr><th>Target</th><th>Number Bolts</th></tr>${targetList}</tbody></table></form>`;
    let dialog = new Promise(async (resolve, reject) => {
        let errorMessage;
        new Dialog({
            title: `${itemD.name} Damage`,
            content: the_content,
            buttons: {
                damage: {
                    label: "Damage", callback: async (html) => {
                        let spentTotal = 0;
                        let selected_targets = html.find('input#target');
                        for (let get_total of selected_targets) {
                            spentTotal += Number(get_total.value);
                        }
                        if (spentTotal > level) {
                            errorMessage = `The spell fails, You assigned more bolts then you have.`;
                            return ui.notifications.error(errorMessage);
                        }
                        if (spentTotal === 0) {
                            errorMessage = `The spell fails, No bolts spent.`;
                            return ui.notifications.error(errorMessage);
                        }
                        damageRoll = new Roll(`1d4[force]+1`).evaluate({ async: false });
                        game.dice3d?.showForRoll(damageRoll);
                        for (let selected_target of selected_targets) {
                            let damageNum = selected_target.value;
                            if (damageNum != null) {
                                let target_id = selected_target.name;
                                let get_target = canvas.tokens.get(target_id);
                                console.log(damageNum);
                                await anime(tokenD, get_target, Number(damageNum));
                                totalDamage = await new Roll(`${damageNum} * ${damageRoll.total}`).evaluate({ async: true });
                                await MidiQOL.applyTokenDamage([{ damage: totalDamage.total, type: damageType }], totalDamage.total, new Set([get_target]), itemUuid, new Set());
                                damage_target.push(`<div class="midi-qol-flex-container"><div>hits</div><div class="midi-qol-target-npc midi-qol-target-name" id="${get_target.id}"> ${get_target.name} [x${damageNum}|<b>${totalDamage.total}</b>]</div><div><img src="${get_target.document.texture.src}" width="30" height="30" style="border:0px"></div></div>`);

                            }
                        }
                        damage_result.push(`<div style="text-align:center">(${CONFIG.DND5E.damageTypes[damageType]})</div><div class="dice-roll"><div class="dice-result"><div class="dice-formula">${damageRoll.formula}</div><div class="dice-tooltip"><section class="tooltip-part"><div class="dice"><header class="part-header flexrow"><span class="part-formula">${damageRoll.formula}</span><span class="part-total">${damageRoll.total}</span></header><ol class="dice-rolls"><li class="roll die d${damageRoll.dice[0].faces}">${damageRoll.dice[0].total}</li></ol></div></section></div><h4 class="dice-total">${damageRoll.total}</h4></div></div>`);
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
    let damage_list = damage_target.join('');
    let damage_results = `<div><div class="midi-qol-nobox">${damage_list}</div></div>`;
    let chatMessage = await game.messages.get(lastArg.itemCardId);
    let content = await duplicate(chatMessage.data.content);
    let searchString = /<div class="midi-qol-hits-display">[\s\S]*<div class="end-midi-qol-hits-display">/g;
    let replaceString = `<div class="midi-qol-hits-display"><div class="end-midi-qol-hits-display">${damage_results}`;
    content = await content.replace(searchString, replaceString);
    return chatMessage.update({ content: content });
}

async function rollList() {
    let damage_results = damage_result.join('');
    let chatMessage = await game.messages.get(lastArg.itemCardId);
    let content = await duplicate(chatMessage.data.content);
    let searchString = /<div class="midi-qol-other-roll">[\s\S]*<div class="end-midi-qol-other-roll">/g;
    let replaceString = `<div class="midi-qol-other-roll"><div class="end-midi-qol-other-roll">${damage_results}`;
    content = await content.replace(searchString, replaceString);
    return chatMessage.update({ content: content });
}

async function anime(token, target, number) {
    new Sequence()
        .effect()
        .file("jb2a.magic_missile.green")
        .repeats(number, 200, 500)
        .atLocation(token, { randomOffset: 0.5 })
        .stretchTo(target)
    .play()
}