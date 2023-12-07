const lastArg = args[args.length - 1];
const tokenOrActor = await fromUuid(lastArg.actorUuid);
const sourceActor = tokenOrActor.actor ? tokenOrActor.actor : tokenOrActor;

if (!["mwak", "rwak", "rsak", "msak"].includes(lastArg.itemData.system.actionType)) return {};
if (lastArg.hitTargets.length < 1) return {};
if (game.combat.active){
  if(game.combat.round != 1) return {};
}

let dialog = new Promise((resolve, reject) => { 
      new Dialog({
      title: "Surprise Attack Damage",
      content: "If your target has not yet taken a turn yet, do an additional 2d6 damage",
      buttons: {
          one: {
              icon: '<i class="fas fa-check"></i>',
              label: "Damage",
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

return {damageRoll: "2d6", flavor: "Surprise Attack"};