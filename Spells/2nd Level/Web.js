const lastArg = args[args.length - 1];
const name = "Web";

async function rollItem(targetToken, item, itemLevel) {
  const caster = item.parent;

  const workflowItemData = foundry.utils.duplicate(item);
  workflowItemData.system.target = { value: 1, units: "", type: "creature" };
  workflowItemData.system.save.ability = "dex";
  workflowItemData.system.properties = [];
  workflowItemData.system.level = itemLevel;
  workflowItemData.system.preparation.mode = "atwill";
  workflowItemData.system.uses = {max: null, per: "", value: null};
  workflowItemData.system.consume = {"type": "", "target": null, "amount": null, "scale": false};
  workflowItemData.system.duration = { value: null, units: "inst" };
  workflowItemData.system.target = { value: null, width: null, units: "", type: "creature" };

  foundry.utils.setProperty(workflowItemData, "flags.itemacro", {});
  foundry.utils.setProperty(workflowItemData, "flags.dae", {});
  foundry.utils.setProperty(workflowItemData, "effects", []);
  foundry.utils.setProperty(workflowItemData, "flags.midi-qol", {});
  delete workflowItemData._id;
  workflowItemData.name = `${workflowItemData.name}: Turn Entry Save`;

  game.user.updateTokenTargets([targetToken.id]);
  const spellItem = new CONFIG.Item.documentClass(workflowItemData, { parent: caster })
  const options = { showFullCard: true, createWorkflow: true, versatile: false, configureDialog: false };
  const result = await MidiQOL.completeItemUse(spellItem, options);

  const failedSaves = [...result.failedSaves];
  if (failedSaves.length > 0) {
    await game.dfreds.effectInterface.addEffect({ effectName: "Restrained", uuid: failedSaves[0].document.uuid });
  } else {
    const effect = targetToken.actor.effects.find(e => e.name.includes(name));
    effect.delete();
  }
}

if (args[0] == "on") {
  const item = await fromUuid(lastArg.efData.origin);
  const saveDC = item.parent.system.attributes.spelldc;
  const target = canvas.tokens.get(lastArg.tokenId);
  await rollItem(target, item, 2);

} else if (args[0] == "off") {
  game.dfreds.effectInterface.removeEffect({ effectName: "Restrained", uuid: lastArg.tokenUuid });
}