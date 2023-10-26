const lastArg = args[args.length - 1];
const tokenOrActor = await fromUuid(lastArg.actorUuid);
const targetActor = tokenOrActor.actor ? tokenOrActor.actor : tokenOrActor;

const gmMacroName = "Wall of Force (GM)";

if (args[0] === "on"){
  // Create a dialogue box to confrim usage.
  let sphere = true;

  let dialog = new Promise((resolve, reject) => { 
      new Dialog({
      title: "Wall of Force Usage",
      content: "Would you like to use a sphere or place up to 10, 10x10 panels?",
      buttons: {
          one: {
              label: "Sphere",
              callback: () => resolve(true)
          },
          two: {
              label: "Panels",
              callback: () => {resolve(false)}
          }
      },
      default: "Sphere"
    }).render(true);
  });  
  sphere = await dialog;

  // --------------
  // FOR SPHERE
  // --------------
  if(sphere){
    Hooks.once("createMeasuredTemplate", async (template) => {
      let radius = canvas.grid.size * (template.distance / canvas.grid.grid.options.dimensions.distance);
      const wofSpellParams = {
        radius,
        x: template.x,
        y: template.y,
        distance: template.distance,
        targetActorId: targetActor.id,
      };
      await DAE.setFlag(targetActor, "wofSpell", wofSpellParams);
      canvas.scene.deleteEmbeddedDocuments("MeasuredTemplate", [template.id]);
      const gmMacro = game.macros.find(m => m.name === gmMacroName);
      gmMacro.execute({state: "on", wofSpellParams});
    });

    const measureTemplateData = {
      t: "circle",
      user: game.userId,
      distance: 10,
      direction: 0,
      x: 0,
      y: 0,
      fillColor: game.user.color,
      flags: {
        spellEffects: {
          WoF: {
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

  // --------------
  // FOR Panels
  // --------------
  else if (!sphere){
    for (let i = 0; i < 10; i++){
      let confirmed = true;
      let useHorizontal = false;
      let dialog = new Promise((resolve, reject) => { 
          new Dialog({
          title: `Placing panel ${i+1} out of 10.`,
          content: `
          <form id="WoFP-use-form">
              <div class="form-group">
                  <label class="checkbox">
                  <input type="checkbox" name="useHorizontal" unchecked/>Place panel horizontally</label>
              </div>
          </form>
          `,
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
          default: "Done",
          close: html => {
            isHorizontal = html.find('[name=useHorizontal]')[0].checked;
          }
        }).render(true);
      });  
      confirmed = await dialog;
      if (!confirmed){
        return;
      }

      Hooks.once("createMeasuredTemplate", async (template) => {
        gridLine = canvas.grid.size * (template.distance / canvas.grid.grid.options.dimensions.distance);
        const wofSpellParams = {
          gridLine,
          isHorizontal,
          direction: template.direction,
          x: template.x,
          y: template.y,
          distance: template.distance,
          targetActorId: targetActor.id,
        };
        await DAE.setFlag(targetActor, "wofSpell", wofSpellParams);
        canvas.scene.deleteEmbeddedDocuments("MeasuredTemplate", [template.id]);
        const gmMacro = game.macros.find(m => m.name === gmMacroName);
        gmMacro.execute({state: "on", wofSpellParams});
      });

      let measureTemplateData = {
        t: "ray",
        user: game.userId,
        distance: 10,
        direction: 0,
        x: 0,
        y: 0,
        fillColor: game.user.color,
        flags: {
          spellEffects: {
            WoF: {
              ActorId: targetActor.id,
            },
          },
        },
      };

      if (isHorizontal){
        measureTemplateData = {
          t: "rect",
          user: game.userId,
          distance: Math.sqrt(200),
          direction: 45,
          x: 0,
          y: 0,
          fillColor: game.user.color,
          flags: {
            spellEffects: {
              WoF: {
                ActorId: targetActor.id,
              },
            },
          },
        };
      }
      
      const doc = new CONFIG.MeasuredTemplate.documentClass(measureTemplateData, { parent: canvas.scene });
      const measureTemplate = new game.dnd5e.canvas.AbilityTemplate(doc);
      measureTemplate.actorSheet = targetActor.sheet;
      measureTemplate.drawPreview();
    }
  }
}


if (args[0] === "off") {
  const wofSpellParams = await DAE.getFlag(targetActor, "wofSpell");
  const gmMacro = game.macros.find(m => m.name === gmMacroName);
  gmMacro.execute({state: "off", wofSpellParams});
  await DAE.unsetFlag(targetActor, "wofSpell");
}