// an OnUse macro used with Midi provided by @kaelad

function addDamageType(damageType, caster) {
  // find the active effect
  const dice = Math.floor((args[0].spellLevel - 1) / 2);
  DAE.setFlag(caster, "spiritShroud", { dice, type: damageType });
}

function selectDamage(caster) {
  // ask for the damage type
  new Dialog({
    title: "Choose the damage type",
    buttons: {
      cold: {
        icon: `<i class="fas fa-snowflake"></i>`,
        label: "Cold",
        callback: () => addDamageType("cold", caster),
      },
      necrotic: {
        icon: `<i class="fas fa-skull-crossbones"></i>`,
        label: "Necrotic",
        callback: () => addDamageType("necrotic", caster),
      },
      radiant: {
        icon: `<i class="fas fa-star-of-life"></i>`,
        label: "Radiant",
        callback: () => addDamageType("radiant", caster),
      },
    },
  }).render(true);
}

// onUse macro
if (args[0].hitTargets.length === 0) return;



if (args[0].tag === "OnUse") {
  console.warn("onuse args:", args)
  const tokenOrActor = await fromUuid(args[0].actorUuid);
  const caster = tokenOrActor.actor ? tokenOrActor.actor : tokenOrActor;
  selectDamage(caster);
} else if (args[0].tag === "DamageBonus") {
  console.warn("damage macro args", args);
  // only attacks
  if (!["mwak", "rwak", "rsak", "msak"].includes(args[0].item.data.actionType)) return {};
  const target = args[0].hitTargets[0];
  // only on the marked target
  if (!hasProperty(target.actor.data, "flags.midi-qol.spiritShroud")) return {};
  const tokenOrActor = await fromUuid(args[0].actorUuid);
  const caster = tokenOrActor.actor ? tokenOrActor.actor : tokenOrActor;
  const data = DAE.getFlag(caster, "spiritShroud");
  const damageType = data.type;
  const diceNumber = data.dice;
  const diceMult = args[0].isCritical ? 2 * diceNumber : diceNumber;
  const damage = { damageRoll: `${diceMult}d8[${damageType}]`, flavor: "Spirit Shroud Damage" };
  return damage;
}