const lastArg = args[args.length - 1];
const tokenOrActor = await fromUuid(lastArg.actorUuid);
const sourceActor = tokenOrActor.actor ? tokenOrActor.actor : tokenOrActor;

if (args[0] === "on") {
  array = game.user.getHotbarMacros();
  macro = array.find(m => m.macro.name == "Unarmed Strike").macro;
  await macro.update({command: "dnd5e.documents.macro.rollItem(\"Unarmed Strike (Fangs)\")"});
  await macro.update({name: "Unarmed Strike (Fangs)"});

  const unarmedStrike = sourceActor.items.getName("Unarmed Strike");
  await unarmedStrike.update({"system.range.value": 20});
  await unarmedStrike.update({"system.damage.parts": [["@scale.monk.martial-arts[fire] + @mod", "fire"]]});
  await unarmedStrike.update({name: "Unarmed Strike (Fangs)"});
}
else if (args[0] === "off") {
  array = game.user.getHotbarMacros();
  macro = array.find(m => m.macro.name == "Unarmed Strike (Fangs)").macro;
  await macro.update({command: "dnd5e.documents.macro.rollItem(\"Unarmed Strike\")"});
  await macro.update({name: "Unarmed Strike"});

  const unarmedStrike = sourceActor.items.getName("Unarmed Strike (Fangs)");
  await unarmedStrike.update({"system.range.value": 10});
  await unarmedStrike.update({"system.damage.parts": [["@scale.monk.martial-arts[bludgeoning] + @mod", "bludgeoning"]]});
  await unarmedStrike.update({name: "Unarmed Strike"});
}
else {
  if (sourceActor.system.resources.primary.value <= 0) return {};
  if (!lastArg.itemData.name.includes("Unarmed Strike")) return {};
  if (lastArg.hitTargets.length < 1) return {};

  let dialog = new Promise((resolve, reject) => { 
        new Dialog({
        title: "Fangs of the Fire Snake Bonus Damage",
        content: `Spend 1 ki point to do an additional 1d10 fire damage?`,
        buttons: {
            one: {
                icon: '<i class="fas fa-check"></i>',
                label: "Fire!",
                callback: () => resolve(true)
            },
            two: {
                icon: '<i class="fas fa-times"></i>',
                label: "Cancel",
                callback: () => {resolve(false)}
            }
        },
        default: "Cancel",
      }).render(true);
    });
  confirmed = await dialog;

  if (!confirmed) return {};

  const value = sourceActor.system.resources.primary.value - 1;
  const item = sourceActor.items.getName("Ki Points");
  await item.update({"system.uses.value": value});

  return {damageRoll: "1d10[fire]", flavor: "Fangs of the Fire Snake"};
}