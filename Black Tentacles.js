const lastArg = args[args.length - 1];
console.log(args);

async function wait(ms) { return new Promise(resolve => { setTimeout(resolve, ms); }); }

function getHighestAbility(actor, abilities) {
  if (typeof abilities === "string") {
    return abilities;
  } else if (Array.isArray(abilities)) {
    return abilities.reduce((prv, current) => {
      if (actor.system.abilities[current].value > actor.system.abilities[prv].value) return current;
      else return prv;
    }, abilities[0]);
  }
}

async function attemptRemoval(targetToken, condition, saveDc) {
  if (game.dfreds.effectInterface.hasEffectApplied(condition, targetToken.document.uuid)) {
    new Dialog({
      title: `Use action to attempt to remove ${condition}?`,
      buttons: {
        one: {
          label: "Yes",
          callback: async () => {
            const ability = getHighestAbility(targetToken.actor, ["str", "dex"]);
            const type = CONFIG.DND5E.abilities[ability];
            const flavor = `${condition} (via Black Tentacles) : ${type} check vs DC${saveDc}`;
            const roll = await targetToken.actor.rollAbilityTest(ability, { flavor, async: true });
            const rollTotal = await roll.total;
            if (rollTotal >= saveDc) {
              const effect = targetToken.actor.effects.find(e => e.label == "Black Tentacles");
              effect.delete();
            } else {
              ChatMessage.create({ content: `${targetToken.name} fails the ${type} check for Black Tentacles, still has the ${condition} condition.` });
            }
          },
        },
        two: {
          label: "No",
          callback: () => {},
        },
      },
    }).render(true);
  }
}

async function rollItem(targetToken, item, itemLevel) {
  const caster = item.parent;

  const workflowItemData = duplicate(item);
  workflowItemData.system.target = { value: 1, units: "", type: "creature" };
  workflowItemData.system.save.ability = "dex";
  workflowItemData.system.components.concentration = false;
  workflowItemData.system.level = itemLevel;
  workflowItemData.system.preparation.mode = "atwill";
  workflowItemData.system.uses = {max: null, per: "", value: null};
  workflowItemData.system.damage.parts[0] = ["3d6[bludgeoning]", "bludgeoning"];
  workflowItemData.system.duration = { value: null, units: "inst" };
  workflowItemData.system.target = { value: null, width: null, units: "", type: "creature" };

  setProperty(workflowItemData, "flags.itemacro", {});
  setProperty(workflowItemData, "flags.dae", {});
  setProperty(workflowItemData, "effects", []);
  delete workflowItemData._id;
  workflowItemData.name = `${workflowItemData.name}: Turn Entry Damage`;
  console.log(workflowItemData);

  game.user.updateTokenTargets([targetToken.id]);
  const spellItem = new CONFIG.Item.documentClass(workflowItemData, { parent: caster })
  const options = { showFullCard: true, createWorkflow: true, versatile: false, configureDialog: false };
  const result = await MidiQOL.completeItemRoll(spellItem, options);

  const failedSaves = [...result.failedSaves];
  if (failedSaves.length > 0) {
    await game.dfreds.effectInterface.addEffect({ effectName: "Restrained", uuid: failedSaves[0].document.uuid });
  } else {
    const effect = targetToken.actor.effects.find(e => e.label == "Black Tentacles");
    effect.delete();
  }
}

if (args[0] == "on") {
  const item = await fromUuid(lastArg.efData.origin);
  const saveDC = item.parent.system.attributes.spelldc;
  const target = canvas.tokens.get(lastArg.tokenId);
  await rollItem(target, item, 4);

  const hasConditionAppliedEnd = game.dfreds.effectInterface.hasEffectApplied("Restrained", target.document.uuid);
  const currentTokenCombatTurn = game.combat.current.tokenId === lastArg.tokenId;
  if (currentTokenCombatTurn && hasConditionAppliedEnd) {
    await attemptRemoval(target, "Restrained", saveDC);
  }
} else if (args[0].tag == "OnUse"){
  const saveDC = lastArg.item.system.save.dc;
  const target = canvas.tokens.get(lastArg.tokenId);
  await attemptRemoval(target, "Restrained", saveDC);
} else if (args[0] == "off") {
  game.dfreds.effectInterface.removeEffect({ effectName: "Restrained", uuid: lastArg.tokenUuid });
}