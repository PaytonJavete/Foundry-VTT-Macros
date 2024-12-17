// an OnUse macro used with Midi provided by @kaelad

function addDamageType(damageType, caster) {
  // find the active effect
  const dice = Math.floor((lastArg.spellLevel - 1) / 2);
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
const lastArg = args[args.length - 1];

if (lastArg.hitTargets.length === 0) return;


if (lastArg.tag === "OnUse") {
  console.warn("onuse args:", args)
  const tokenOrActor = await fromUuid(lastArg.actorUuid);
  const caster = tokenOrActor.actor ? tokenOrActor.actor : tokenOrActor;
  selectDamage(caster);
} else if (lastArg.tag === "DamageBonus") {
  console.warn("damage macro args", args);
  // only attacks
  if (!["mwak", "rwak", "rsak", "msak"].includes(lastArg.item.data.actionType)) return {};
  const target = lastArg.hitTargets[0];
  // only on the marked target
  if (!hasProperty(target.actor, "flags.midi-qol.spiritShroud")) return {};
  const tokenOrActor = await fromUuid(lastArg.actorUuid);
  const caster = tokenOrActor.actor ? tokenOrActor.actor : tokenOrActor;
  const data = DAE.getFlag(caster, "spiritShroud");
  const damageType = data.type;
  const diceNumber = data.dice;
  const diceMult = lastArg.isCritical ? 2 * diceNumber : diceNumber;
  const damage = { damageRoll: `${diceMult}d8[${damageType}]`, flavor: "Spirit Shroud Damage" };
  return damage;
}