const summon = CompanionManager.api.dnd5e.getSummonInfo(args, 5);
const celestialDamage = {
  mace: [`1d10[radiant]+3+${summon.level + 5}`, 'radiant'],
  heal: [`2d8[healing]+${summon.level + 5}`, 'healing'],
}

return {
  actor: {
    "system.attributes.ac.flat": 18 + summon.level,
    "system.attributes.hp.max": 40 + summon.level*10,
    "system.attributes.hp.value": 40 + summon.level*10,
  },
  embedded: {
    Item: {
      "Radiant Mace": {
        "system.attackBonus": summon.attack.ms,
        "system.damage.parts":[celestialDamage.mace]
      },
      "Multiattack": {
        "system.description.value": `The celestial makes ${Math.floor((5 + summon.level)/2)} attacks`
      },
      "Healing Touch": {
        "system.damage.parts":[celestialDamage.heal]
      },
    }
  }
}