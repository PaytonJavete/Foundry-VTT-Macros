if (!game.modules.get("advanced-macros")?.active) ui.notifications.error("Please enable the Advanced Macros module");

console.log(args);

const lastArg = args[args.length - 1];
const tokenOrActor = await fromUuid(lastArg.actorUuid);
const targetActor = tokenOrActor.actor ? tokenOrActor.actor : tokenOrActor;

const gmMacroName = "Wall of Stone (GM)";

if (args[0] === "on"){
  // Create a dialogue box to confirm usage.
  let thick = true;

  let dialog = new Promise((resolve, reject) => { 
      new Dialog({
      title: "Wall of Stone Usage",
      content: "Would you like place up to 10, 10\'x10\'x6\" or 10\'x20\'x3\" panels?",
      buttons: {
          one: {
              label: "Thick Panels",
              callback: () => resolve(true)
          },
          two: {
              label: "Tall Panels",
              callback: () => {resolve(false)}
          }
      },
      default: "Thick Panels"
    }).render(true);
  });  
  thick = await dialog;

  for (let i = 1; i <= 10; i++){
    let confirmed = true;
    let useHorizontal = false;
    let dialog = new Promise((resolve, reject) => { 
        new Dialog({
        title: `Placing panel ${i} out of 10.`,
        content: `
        <form id="wosP-use-form">
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

    let image = 'https://assets.forge-vtt.com/62771065dc9d0e273df623d2/tokenizer/npc-images/Stone%20Wall%20Line.png';

    Hooks.once("createMeasuredTemplate", async (template) => {
      gridLine = canvas.grid.size * (template.distance / canvas.grid.grid.options.dimensions.distance);
      const wosSpellParams = {
        gridLine,
        isHorizontal,
        direction: template.direction,
        x: template.x,
        y: template.y,
        distance: template.distance,
        targetActorId: targetActor.id,
        isThick: thick,
        tokenImage: image,
      };
      await DAE.setFlag(targetActor, "wosSpell", wosSpellParams);
      canvas.scene.deleteEmbeddedDocuments("MeasuredTemplate", [template.id]);
      const gmMacro = game.macros.find(m => m.name === gmMacroName);
      gmMacro.execute("on", wosSpellParams);
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
          wos: {
            ActorId: targetActor.id,
          },
        },
      },
    };

    if (isHorizontal){
      if (thick){
        image = 'https://assets.forge-vtt.com/62771065dc9d0e273df623d2/tokenizer/npc-images/Stone%20Wall%20Horizontal.png';
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
              wos: {
                ActorId: targetActor.id,
              },
            },
          },
        };
      } else {
        image = 'https://assets.forge-vtt.com/62771065dc9d0e273df623d2/tokenizer/npc-images/Stone%20Wall%20Horizontal%20Double.png';
        measureTemplateData = {
          t: "ray",
          user: game.userId,
          distance: 20,
          width: 10,
          direction: 0,
          x: 0,
          y: 0,
          fillColor: game.user.color,
          flags: {
            spellEffects: {
              wos: {
                ActorId: targetActor.id,
              },
            },
          },
        };
      }
    } 

    const doc = new CONFIG.MeasuredTemplate.documentClass(measureTemplateData, { parent: canvas.scene });
    const measureTemplate = new game.dnd5e.canvas.AbilityTemplate(doc);
    measureTemplate.actorSheet = targetActor.sheet;
    measureTemplate.drawPreview();
  }
}


if (args[0] === "off" && !args[1]["expiry-reason"]?.includes("times-up")) {
  const params = await DAE.getFlag(targetActor, "wosSpell");
  const gmMacro = game.macros.find(m => m.name === gmMacroName);
  gmMacro.execute("off", params);
  await DAE.unsetFlag(targetActor, "wosSpell");
}