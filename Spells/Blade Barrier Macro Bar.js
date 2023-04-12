let circle = true;
let dialog = new Promise((resolve, reject) => {
      new Dialog({
          title: 'Blade Barrier Configuration',
          content: `
          `,

          buttons: {
            one: {
                icon: '<i class="fas fa-check"></i>',
                label: "Ring",
                callback: () => resolve(true)
            },
            two: {
                icon: '<i class="fas fa-times"></i>',
                label: "Line",
                callback: () => {resolve(false)}
            }
        },
      }).render(true);
  })
circle = await dialog;

const actor = canvas.tokens.controlled[0].actor
DAE.setFlag(actor, "Blade Barrier", circle);

const item = actor.items.getName("Blade Barrier");
const workflowItemData = duplicate(item);
if(circle){
  workflowItemData.system.target = {type: "radius", units: "ft", value: 30};
}

const spellItem = new CONFIG.Item.documentClass(workflowItemData, { parent: actor });
const options = { showFullCard: true, createWorkflow: true, configureDialog: true };
await MidiQOL.completeItemRoll(spellItem, options);  