const lastArg = args[args.length - 1];
const tokenOrActor = await fromUuid(lastArg.actorUuid);
const actorM = tokenOrActor.actor ? tokenOrActor.actor : tokenOrActor;
const rays = 1 + Number(lastArg.spellLevel);

for (let i = 2; i <= rays; i++){
    let confirmed = true;
    let dialog = new Promise((resolve, reject) => { 
      new Dialog({
      title: `Scorching Ray Level ${lastArg.spellLevel}`,
      content: `Select a target for ray number ${i} out of ${rays}.`,
      buttons: {
          one: {
              icon: '<i class="fas fa-check"></i>',
              label: "Fire",
              callback: () => resolve(true)
          },
          two: {
              icon: '<i class="fas fa-times"></i>',
              label: "Stop",
              callback: () => {resolve(false)}
          }
      },
      default: "Stop",
    }).render(true);
    });  
    confirmed = await dialog;

    if (!confirmed){
        return;
    }

    const item = actorM.items.getName("Scorching Ray (Circlet)");
    const workflowItemData = duplicate(item);
    workflowItemData.system.consume.type = "";
    workflowItemData.system.consume.target = "";
    setProperty(workflowItemData, "flags.itemacro", {});
    setProperty(workflowItemData, "flags.midi-qol", {});
    setProperty(workflowItemData, "flags.dae", {});

    const spellItem = new CONFIG.Item.documentClass(workflowItemData, { parent: actorM });
    const options = { showFullCard: false, createWorkflow: true, configureDialog: false};
    const result = await MidiQOL.completeItemUse(spellItem, options);
}