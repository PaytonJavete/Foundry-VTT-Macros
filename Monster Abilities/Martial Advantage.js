if (!["mwak","rwak"].includes(args[0].itemData.system.actionType)) return {}; // weapon attack
if (args[0].hitTargets.length < 1) return {};
token = canvas.tokens.get(args[0].tokenId);
actor = token.actor;
if (!actor || !token || args[0].hitTargets.length < 1) return {};
let target = canvas.tokens.get(args[0].hitTargets[0].id ?? args[0].hitTargers[0]._id);
if (!target) MidiQOL.error("Martial Advantage macro failed");

if (game.combat) {
  const combatTime = `${game.combat.id}-${game.combat.round + game.combat.turn /100}`;
  const lastTime = actor.getFlag("midi-qol", "martialAdvantageTime");
  if (combatTime === lastTime) {
   MidiQOL.warn("Martial Advantage: Already done damage this turn");
   return {};
  }
}

let isMA = false;
let nearbyEnemy = canvas.tokens.placeables.filter(t => {
  let nearby = (t.actor &&
       t.actor?.id !== args[0].actor._id && // not me
       t.id !== target.id && // not the target
       t.actor?.system.attributes?.hp?.value > 0 && // not incapacitated
       t.document.disposition !== target.document.disposition && // not an ally
       MidiQOL.computeDistance(t, target) <= 5 // close to the target
   );
  return nearby;
});
isMA = nearbyEnemy.length > 0;

if (!isMA) {
  MidiQOL.warn("Martial Advantage: No ally next to target");
  return {};
}

let confirmed = false
let dialog = new Promise((resolve, reject) => {
  new Dialog({
  // localize this text
  title: "Conditional Damage",
  content: `<p>Use Martial Advantage?</p>`,
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
  default: "two",
  close: html => {
      resolve();
  }
  }).render(true);
});
confirmed = await dialog;
if (!confirmed) return {}

if (game.combat) {
  const combatTime = `${game.combat.id}-${game.combat.round + game.combat.turn /100}`;
  const lastTime = actor.getFlag("midi-qol", "martialAdvantageTime");
  if (combatTime !== lastTime) {
     await actor.setFlag("midi-qol", "martialAdvantageTime", combatTime)
  }
}

const baseDice = 2;
const damageFormula = new CONFIG.Dice.DamageRoll(`${baseDice}d6`, {}, {
    critical: args[0].isCritical ?? false, 
    powerfulCritical: game.settings.get("dnd5e", "criticalDamageMaxDice"),
    multiplyNumeric: game.settings.get("dnd5e",  "criticalDamageModifiers")
}).formula

return {damageRoll: damageFormula, flavor: "Martial Advantage"};