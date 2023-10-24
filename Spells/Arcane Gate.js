const lastArg = args[args.length - 1];
const tokenOrActor = await fromUuid(lastArg.actorUuid);
const targetActor = tokenOrActor.actor ? tokenOrActor.actor : tokenOrActor;

const gmMacroName = "Arcane Gate (GM)";

if (args[0] === "on"){  
  for (let i = 0; i < 2; i++){
    let confirmed = true;
    let dialog = new Promise((resolve, reject) => { 
        new Dialog({
        title: `Placing gate ${i+1}.`,
        content: "",
        buttons: {
            one: {
                icon: '<i class="fas fa-check"></i>',
                label: "Place",
                callback: () => resolve(true)
            },
            two: {
                icon: '<i class="fas fa-times"></i>',
                label: "Done",
                callback: () => {resolve(false)}
            }
        },
        default: "Done"
      }).render(true);
    });  
    confirmed = await dialog;
    if (!confirmed) return;

    Hooks.once("createMeasuredTemplate", async (template) => {
      const agSpellParams = {
        x: template.x,
        y: template.y,
        targetActorId: targetActor.id,
      };
      await DAE.setFlag(targetActor, "agSpell", agSpellParams);
      canvas.scene.deleteEmbeddedDocuments("MeasuredTemplate", [template.id]);
      const gmMacro = game.macros.find(m => m.name === gmMacroName);
      gmMacro.execute({state: "on", agSpellParams});
    });

    let measureTemplateData = {
      t: "circle",
      user: game.userId,
      distance: 2.5,
      direction: 0,
      x: 0,
      y: 0,
      fillColor: game.user.color,
      flags: {
        spellEffects: {
          AG: {
            ActorId: targetActor.id,
          },
        },
      },
    };
    
    const doc = new CONFIG.MeasuredTemplate.documentClass(measureTemplateData, { parent: canvas.scene });
    const measureTemplate = new game.dnd5e.canvas.AbilityTemplate(doc);
    measureTemplate.actorSheet = targetActor.sheet;
    measureTemplate.drawPreview();
  }
}


if (args[0] === "off") {
  const agSpellParams = await DAE.getFlag(targetActor, "agSpell");
  const gmMacro = game.macros.find(m => m.name === gmMacroName);
  gmMacro.execute({state: "off", agSpellParams});
  await DAE.unsetFlag(targetActor, "agSpell");
}