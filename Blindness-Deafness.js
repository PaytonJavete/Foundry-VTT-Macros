if (!game.modules.get("advanced-macros")?.active) {
  ui.notifications.error("Please enable the Advanced Macros module");
  return;
}
if (!game.modules.get("dfreds-convenient-effects")?.active) {
  ui.notifications.error("Please enable the CE module");
  return;
}

const lastArg = args[args.length - 1];
const tokenOrActor = await fromUuid(lastArg.actorUuid);
const targetActor = tokenOrActor.actor ? tokenOrActor.actor : tokenOrActor;

function effectAppliedAndActive(conditionName) {
  return targetActor.data.effects.some(
    (activeEffect) =>
      activeEffect?.data?.flags?.isConvenient &&
      activeEffect?.data?.label == conditionName &&
      !activeEffect?.data?.disabled
  );
}

if (args[0] === "on") {
  new Dialog({
    title: "Choose an Effect",
    buttons: {
      blind: {
        label: "Blindness",
        callback: () => {
          DAE.setFlag(targetActor, "DAEBlind", "blind");
          game.dfreds.effectInterface.addEffect({ effectName: "Blinded", uuid: targetActor.uuid });
        },
      },
      deaf: {
        label: "Deafness",
        callback: () => {
          DAE.setFlag(targetActor, "DAEBlind", "deaf");
          game.dfreds.effectInterface.addEffect({ effectName: "Deafened", uuid: targetActor.uuid });
        },
      },
    },
  }).render(true);
}

if (args[0] === "off") {
  let flag = DAE.getFlag(targetActor, "DAEBlind");
  if (flag === "blind") {
    if (effectAppliedAndActive("Blinded", targetActor))
      game.dfreds.effectInterface.removeEffect({ effectName: "Blinded", uuid: targetActor.uuid });
  } else if (flag === "deaf") {
    if (effectAppliedAndActive("Deafened", targetActor))
      game.dfreds.effectInterface.removeEffect({ effectName: "Deafened", uuid: targetActor.uuid });
  }
  DAE.unsetFlag(targetActor, "DAEBlind");
}