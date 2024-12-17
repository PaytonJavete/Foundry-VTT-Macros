const summon = CompanionManager.api.dnd5e.getSummonInfo(args, 2);
const flamingSphere = {
  sphere: [`${summon.level + 2}d6`, 'fire'],
}
return {
  embedded: {
    Item: {
      "Flaming Sphere Slam": {
        "system.description.value": `Any creature that ends its turn within 5 feet of the sphere, or has the sphere rammed into it, must make a Dexterity saving throw (DC ${summon.dc}). The creature takes ${flamingSphere.sphere[0]} ${flamingSphere.sphere[1]} damage on a failed save, or half as much damage on a successful one.`,
        "system.save.dc": summon.dc,
        "system.damage.parts":[flamingSphere.sphere]
      },
      "Flaming Sphere Aura": {
        "system.save.dc": summon.dc,
        "system.level": summon.level + 2
      }
    }
  }
}