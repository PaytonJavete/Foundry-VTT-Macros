// Item macro, Midi-qol On Use. This handles damage, so remove it from the spell card. This macro is for RAW damage, not RAI.
async function wait(ms) { return new Promise(resolve => { setTimeout(resolve, ms); }); }
const lastArg = args[args.length - 1];
const actor = lastArg.actor;
const item = lastArg.item;
const rays = 1 + Number(lastArg.spellLevel);

console.log(item);
const workflowItemData = duplicate(item);
workflowItemData.system.preparation.mode = "atwill";
workflowItemData.system.uses = {max: null, per: "", value: null};
workflowItemData.system.damage.parts = [["2d6[fire]", "fire"]];
workflowItemData.system.actionType = "rsak";
workflowItemData.system.chatFlavor = "";
setProperty(workflowItemData, "name", "Scorching Ray Blast");
setProperty(workflowItemData, "flags.itemacro", {});
setProperty(workflowItemData, "flags.midi-qol", {});
setProperty(workflowItemData, "flags.dae", {});

const spellItem = new CONFIG.Item.documentClass(workflowItemData, { parent: canvas.tokens.controlled[0].actor });
const options = { showFullCard: false, createWorkflow: true, configureDialog: true};

if (lastArg.targets.length === 1) {
    for (i = 0; i < rays; i++){
        await MidiQOL.completeItemRoll(spellItem, options);
    }
} else if (lastArg.targets.length > 1) {
    let targetList = lastArg.targets.reduce((list, target) => { return list + `<tr><td>${target.name}</td><td><input type="num" id="target" min="0" max="${rays}" name="${target.id}"></td></tr>` }, "");
    let the_content = `<p>You have currently <b>${rays}</b> total ${item.name} rays.</p><form class="flexcol"><table width="100%"><tbody><tr><th>Target</th><th>Number Rays</th></tr>${targetList}</tbody></table></form>`;
    let dialog = new Promise(async (resolve, reject) => {
        let errorMessage;
        new Dialog({
            title: `${item.name} Blasts`,
            content: the_content,
            buttons: {
                blast: {
                    label: "Blast", callback: async (html) => {
                        let spentTotal = 0;
                        let selected_targets = html.find('input#target');
                        for (let get_total of selected_targets) {
                            spentTotal += Number(get_total.value);
                        }
                        if (spentTotal > rays) {
                            errorMessage = `The spell fails, You assigned more rayts then you have.`;
                            return ui.notifications.error(errorMessage);
                        }
                        if (spentTotal === 0) {
                            errorMessage = `The spell fails, No rays spent.`;
                            return ui.notifications.error(errorMessage);
                        }

                        for (let selected_target of selected_targets) {
                            let numRays = selected_target.value;
                            if (numRays != null || 0) {
                                let target_id = canvas.tokens.get(selected_target.name).id;
                                game.user.updateTokenTargets([target_id]);
                                for (i = 0; i < numRays; i++){
                                    const result = await MidiQOL.completeItemRoll(spellItem, options);
                                }
                            }
                        }
                        resolve();
                    }
                }
            },
            close: async (html) => {
                if(errorMessage) reject(new Error(errorMessage));
            },
            default: "blast"
        }).render(true);
    });
    await dialog;
}