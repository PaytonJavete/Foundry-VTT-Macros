const lastArg = args[args.length-1];

if (lastArg.hitTargets.length < 1) return {};

token = canvas.tokens.get(lastArg.tokenId);
s_actor = token.actor;

const item = s_actor.items.getName("Psionic Power: Psionic Energy");
value = s_actor.system.resources.primary.value - 1;
if (value < 0) return {};

const safeName = lastArg.itemData.name.replace(/\s|'|\.|’/g, "_");

//Track if used already this turn
if (game.combat) {
    if (lastArg.tokenId != game.combat?.current.tokenId) return {}; // their turn 
    const tracker = DAE.getFlag(s_actor, `${safeName}Tracker`);
    if (tracker){
        if (tracker.round == game.combat.round) return {};
    }
}

let confirmed = false;
let knockProne = true;

// Create a dialogue box to select spell slot level to use when smiting.
let dialog = new Promise((resolve, reject) => { 
    new Dialog({
    title: "Psionic Strike: Usage Configuration",
    content: `
    <form id="psistrike-use-form">
        <div class="form-group">
            <label class="checkbox">
            <input type="checkbox" name="knockProne" checked/>Knock Prone?</label>
        </div>
    </form>
    `,
    buttons: {
        one: {
            icon: '<i class="fas fa-check"></i>',
            label: "Strike!",
            callback: () => resolve(true)
        },
        two: {
            icon: '<i class="fas fa-times"></i>',
            label: "Cancel",
            callback: () => {resolve(false)}
        }
    },
    default: "Cancel",
    close: html => {
        knockProne = html.find('[name=knockProne]')[0].checked;
    }
  }).render(true);
});
confirmed = await dialog;

if(!confirmed){
    return;
} else {
    await item.update({"system.uses.value": value});
    await DAE.setFlag(s_actor, `${safeName}Tracker`, {round: game.combat.round});
}

const dice = args[0].isCritical ? 2: 1;
let targets = game.user.targets;
const [target] = targets;
let targetUuid = target.actor.uuid;
if (knockProne){
    let save_roll = await target.actor.rollAbilitySave("str", {chatMessage : true, async: true });
    let spellDC = s_actor.system.attributes.spelldc;
    if (save_roll.total < spellDC){
        const hasEffectApplied = await game.dfreds.effectInterface.hasEffectApplied('Prone', targetUuid);
        if (!hasEffectApplied) {
          game.dfreds.effectInterface.addEffect({ effectName: 'Prone', uuid: targetUuid });
        }
    }
}

new Sequence()
      .effect()
        .atLocation(target)
        .file("jb2a.divine_smite.target.purplepink")
      .play();

return {damageRoll: `${dice}d10+3[psychic]`, flavor: "Psionic Strike"};