if (game.user.targets.size != 1) return ui.notifications.error("Must target exactly 1 creature");

let [target] = game.user.targets;
const homunculus = target.actor;

const hitDice = actor.system.attributes.hd;
if (hitDice == 0){
    return ui.notifications.warn("Homunculus HP Transfer: No hit dice to spend");
}

let hdOptions = "";
for (let i = 1; i <= hitDice; i++){
    hdOptions += `<option value="${i}">${i}</option>`;
}

let confirmed = false;
let hitDiceSpent = 0;
let dialog = new Promise((resolve, reject) => { 
    new Dialog({
    title: "Homunculus HP Transfer",
    content: `
    <form id="hp-transfer-form">
        <p>Choose how many hit dice to spend on transfering your life force to your homunculus.</p>
        <div class="form-group">
            <label>Hit Dice</label>
            <div class="form-fields">
                <select name="hd">` + hdOptions + `</select>
            </div>
        </div>
    </form>
    `,
    buttons: {
        one: {
            icon: '<i class="fas fa-check"></i>',
            label: "Confirm",
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
        hitDiceSpent = parseInt(html.find('[name=hd]')[0].value);
    }
  }).render(true);
});
confirmed = await dialog;

if (!confirmed) return;

let conBonus = hitDiceSpent*actor.system.abilities.con.mod;

HDRoll = await new Roll(`${hitDiceSpent}d6+${conBonus}`).evaluate({async: true});
await game.dice3d.showForRoll(HDRoll);
rollTotal = HDRoll.total;

//Apply Caster effect
let uuid = actor.uuid;

let hasEffectApplied = await game.dfreds.effectInterface.hasEffectApplied('Homunculus Max HP Decrease', uuid);
if (hasEffectApplied) game.dfreds.effectInterface.removeEffect({ effectName: 'Homunculus Max HP Decrease', uuid });

let effectData = game.dfreds.effectInterface.findEffectByName('Homunculus Max HP Decrease').data;
effectData.changes[0].value = 0-rollTotal;
await game.dfreds.effectInterface.addEffectWith({ effectData, uuid });

//Apply Homunuclus effect
uuid = homunculus.uuid;

hasEffectApplied = await game.dfreds.effectInterface.hasEffectApplied('Homunculus Max HP Increase', uuid);
if (hasEffectApplied) game.dfreds.effectInterface.removeEffect({ effectName: 'Homunculus Max HP Increase', uuid });

effectData = game.dfreds.effectInterface.findEffectByName('Homunculus Max HP Increase').data;
effectData.changes[0].value = rollTotal;
await game.dfreds.effectInterface.addEffectWith({ effectData, uuid });

//Update HP
await actor.update({"system.attributes.hp.value": actor.system.attributes.hp.max})
await homunculus.update({"system.attributes.hp.value": homunculus.system.attributes.hp.max})

//Update HD used
// let actorClass = actor.classes;
// let hitDie = actorClass.system.hitDice
const hdSpentUpdate = actor.classes.wizard.system.hitDiceUsed + hitDiceSpent;
actor.classes.wizard.update({"system.hitDiceUsed": hdSpentUpdate});