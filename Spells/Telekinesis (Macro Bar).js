let object = true;
let dialog = new Promise((resolve, reject) => {
      new Dialog({
          title: 'Telekinesis Configuration',
          content: `
          `,

          buttons: {
            one: {
                icon: '<i class="fas fa-check"></i>',
                label: "Object",
                callback: () => resolve(true)
            },
            two: {
                icon: '<i class="fas fa-times"></i>',
                label: "Creature",
                callback: () => {resolve(false)}
            }
        },
      }).render(true);
  })
object = await dialog;

const item = actor.items.getName("Telekinesis");
const workflowItemData = duplicate(item);

let concentrating = actor.effects.some(effect => effect.sourceName == "Telekinesis" && effect.label == "Concentrating");
if(concentrating){
  workflowItemData.system.components.concentration = false;
  workflowItemData.system.duration = { value: null, units: "inst" };
}

if(object){
  workflowItemData.system.save.ability = "dex";
  workflowItemData.system.damage.parts[0] = ["3d8[bludgeoning]", "bludgeoning"];
  setProperty(workflowItemData, "effects", []);
} else {
  setProperty(workflowItemData, "flags.midi-qol", {});
}

const spellItem = new CONFIG.Item.documentClass(workflowItemData, { parent: actor });
const options = { showFullCard: false, createWorkflow: true, configureDialog: true };
const result = await MidiQOL.completeItemRoll(spellItem, options);