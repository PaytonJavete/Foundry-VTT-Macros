let cast = false;
let dialog = new Promise((resolve, reject) => { 
    new Dialog({
    title: "Contingency Cast or Proc",
    content: `<p>Would you like to cast contingency or proc its current stored spell?</p>`,
    buttons: {
        one: {
            icon: '<i class="fas fa-check"></i>',
            label: "Cast",
            callback: () => resolve(true)
        },
        two: {
            icon: '<i class="fas fa-times"></i>',
            label: "Proc",
            callback: () => {resolve(false)}
        }
    },
    default: "Cancel"
  }).render(true);
});
cast = await dialog;

if (cast){
    game.dnd5e.macros.rollItem("Contingency")
} else {
    const token = canvas.tokens.controlled[0]
    const actor = token.actor;
    let effect = actor.effects.find(effect => effect.label.includes("Contingency"));

    if (effect == undefined){
        return ui.notifications.warn("No Contingency Effect to proc");
    }

    const tracker = DAE.getFlag(actor, "ContingencyTracker");
    name = tracker.name;
    level = tracker.level;

    await DAE.unsetFlag(actor, "ContingencyTracker");
    effect.delete();

    const item = actor.items.getName(name);
    const workflowItemData = duplicate(item);
    workflowItemData.system.target = { value: 1, units: "", type: "creature" };
    workflowItemData.system.level = level;
    workflowItemData.system.range = { value: null, width: null, units: "", type: "self" };
    workflowItemData.system.preparation.mode = "atwill";
    workflowItemData.system.uses = {max: null, per: "", value: null};

    let scaling = item.system.scaling;
    let originalLevel = item.system.level;
    if (scaling.mode != "none" && originalLevel < level){
        if (scaling.mode == "level"){
            if (scaling.formula.includes("@item.level")){
                let formula = " + " + scaling.formula.replace('@item.level', `${level}`);
                workflowItemData.system.damage.parts[0][0] += formula;
            } else {
                let stringScaleDice = scaling.formula.split('d')[0];
                let scaleDice = parseInt(stringScaleDice) * (level - originalLevel);
                let formula = " + " + scaling.formula.replace(stringScaleDice, `${scaleDice}`);
                workflowItemData.system.damage.parts[0][0] += formula;
            }
        } else {
            ui.notifications.warn("Upcast scalling spell not scaled in Contingency Proc!")
        }
    }

    game.user.updateTokenTargets([token.id]);
    const spellItem = new CONFIG.Item.documentClass(workflowItemData, { parent: actor });
    const options = { showFullCard: false, createWorkflow: true, configureDialog: true };
    const result = await MidiQOL.completeItemRoll(spellItem, options);
}