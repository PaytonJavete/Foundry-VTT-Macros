let cast = false;
let dialog = new Promise((resolve, reject) => { 
    new Dialog({
    title: "Holy Weapon Cast or Burst",
    content: `<p>Would you like to cast sunbeam or burst as a bonus action?</p>`,
    buttons: {
        one: {
            icon: '<i class="fas fa-magic"></i>',
            label: "Cast",
            callback: () => resolve(true)
        },
        two: {
            icon: '<i class="fas fa-crosshairs"></i>',
            label: "Burst",
            callback: () => {resolve(false)}
        }
    },
    default: "Burst"
  }).render(true);
});
cast = await dialog;

if(cast){
    game.dnd5e.macros.rollItem("Holy Weapon");
} else {
    const actor = canvas.tokens.controlled[0].actor
    const uuid = actor.uuid;
    let hasEffectApplied = await game.dfreds.effectInterface.hasEffectApplied('Concentrating', uuid);

    if (hasEffectApplied) {
        game.dfreds.effectInterface.removeEffect({ effectName: 'Concentrating', uuid });
    } else {
        return ui.notifications.error("Not Concentrating on Holy Weapon!");
    }

    let weaponHolder = null;
    if (game.user.targets.size == 1){
        [token] = game.user.targets;
        weaponHolder = token.actor;
        playSequnceEffect(token);
    } else {
        return ui.notifications.error("Holy Weapon Burst should target only one creature");
    }

    const item = actor.items.getName("Holy Weapon");
    const workflowItemData = duplicate(item);
    workflowItemData.system.components.concentration = false;
    workflowItemData.system.preparation.mode = "atwill";
    workflowItemData.system.uses = {max: null, per: "", value: null};
    workflowItemData.system.target = { value: 30, units: "ft", type: "enemy" };
    workflowItemData.system.save = { ability: "con", dc: actor.system.attributes.spelldc, scaling: "spell"};
    workflowItemData.system.range = { value: null, units: "spec", long: null };
    workflowItemData.system.damage.parts = [["4d8[radiant]", "radiant"]];
    effect = workflowItemData.effects.find(effect => effect.label == "Holy Weapon Burst");
    effect.disabled = false;
    setProperty(workflowItemData, "flags.itemacro", {});
    setProperty(workflowItemData, "effects", [effect]);
    delete workflowItemData._id;
    workflowItemData.name = `${workflowItemData.name} Burst`;
    workflowItemData.system.chatFlavor = "[4d8 - radiant] to all enemies within 30 ft. of holy weapon"

    const spellItem = new CONFIG.Item.documentClass(workflowItemData, { parent: weaponHolder });
    const options = { showFullCard: false, createWorkflow: true, configureDialog: true };
    const result = await MidiQOL.completeItemRoll(spellItem, options);  
}

function playSequnceEffect(token){
    new Sequence()
        .effect()
          .file("modules/jb2a_patreon/Library/Generic/Explosion/Explosion_02_Yellow_400x400.webm")
          .size({
            width: canvas.grid.size * ((30*2.5) / canvas.dimensions.distance),
            height: canvas.grid.size * ((30*2.5) / canvas.dimensions.distance),
          })
          .atLocation(token)
        .play();
}