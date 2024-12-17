const lastArg = args[args.length - 1];
const tokenOrActor = await fromUuid(lastArg.actorUuid);
const targetActor = tokenOrActor.actor ? tokenOrActor.actor : tokenOrActor;

const gmMacroName = "Dancing Lights (GM)";

if (args[0] === "on"){
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
        DL: {
          ActorId: targetActor.id,
        },
      },
    },
  };
  let lights = true;
  let color = null;

  const colorValues = [
    {hex: "#F0F8FF", name: "AliceBlue"},
    {hex: "#FAEBD7", name: "AntiqueWhite"},
    {hex: "#00FFFF", name: "Aqua"},
    {hex: "#7FFFD4", name: "Aquamarine"},
    {hex: "#F0FFFF", name: "Azure"},
    {hex: "#F5F5DC", name: "Beige"},
    {hex: "#FFE4C4", name: "Bisque"},
    {hex: "#000000", name: "Black"},
    {hex: "#FFEBCD", name: "BlanchedAlmond"},
    {hex: "#0000FF", name: "Blue"},
    {hex: "#8A2BE2", name: "BlueViolet"},
    {hex: "#A52A2A", name: "Brown"},
    {hex: "#DEB887", name: "BurlyWood"},
    {hex: "#5F9EA0", name: "CadetBlue"},
    {hex: "#7FFF00", name: "Chartreuse"},
    {hex: "#D2691E", name: "Chocolate"},
    {hex: "#FF7F50", name: "Coral"},
    {hex: "#6495ED", name: "CornflowerBlue"},
    {hex: "#FFF8DC", name: "Cornsilk"},
    {hex: "#DC143C", name: "Crimson"},
    {hex: "#00FFFF", name: "Cyan"},
    {hex: "#00008B", name: "DarkBlue"},
    {hex: "#008B8B", name: "DarkCyan"},
    {hex: "#B8860B", name: "DarkGoldenRod"},
    {hex: "#A9A9A9", name: "DarkGray"},
    {hex: "#A9A9A9", name: "DarkGrey"},
    {hex: "#006400", name: "DarkGreen"},
    {hex: "#BDB76B", name: "DarkKhaki"},
    {hex: "#8B008B", name: "DarkMagenta"},
    {hex: "#556B2F", name: "DarkOliveGreen"},
    {hex: "#FF8C00", name: "DarkOrange"},
    {hex: "#9932CC", name: "DarkOrchid"},
    {hex: "#8B0000", name: "DarkRed"},
    {hex: "#E9967A", name: "DarkSalmon"},
    {hex: "#8FBC8F", name: "DarkSeaGreen"},
    {hex: "#483D8B", name: "DarkSlateBlue"},
    {hex: "#2F4F4F", name: "DarkSlateGray"},
    {hex: "#2F4F4F", name: "DarkSlateGrey"},
    {hex: "#00CED1", name: "DarkTurquoise"},
    {hex: "#9400D3", name: "DarkViolet"},
    {hex: "#FF1493", name: "DeepPink"},
    {hex: "#00BFFF", name: "DeepSkyBlue"},
    {hex: "#696969", name: "DimGray"},
    {hex: "#696969", name: "DimGrey"},
    {hex: "#1E90FF", name: "DodgerBlue"},
    {hex: "#B22222", name: "FireBrick"},
    {hex: "#FFFAF0", name: "FloralWhite"},
    {hex: "#228B22", name: "ForestGreen"},
    {hex: "#FF00FF", name: "Fuchsia"},
    {hex: "#DCDCDC", name: "Gainsboro"},
    {hex: "#F8F8FF", name: "GhostWhite"},
    {hex: "#FFD700", name: "Gold"},
    {hex: "#DAA520", name: "GoldenRod"},
    {hex: "#808080", name: "Gray"},
    {hex: "#808080", name: "Grey"},
    {hex: "#008000", name: "Green"},
    {hex: "#ADFF2F", name: "GreenYellow"},
    {hex: "#F0FFF0", name: "HoneyDew"},
    {hex: "#FF69B4", name: "HotPink"},
    {hex: "#CD5C5C", name: "IndianRed"},
    {hex: "#4B0082", name: "Indigo"},
    {hex: "#FFFFF0", name: "Ivory"},
    {hex: "#F0E68C", name: "Khaki"},
    {hex: "#E6E6FA", name: "Lavender"},
    {hex: "#FFF0F5", name: "LavenderBlush"},
    {hex: "#7CFC00", name: "LawnGreen"},
    {hex: "#FFFACD", name: "LemonChiffon"},
    {hex: "#ADD8E6", name: "LightBlue"},
    {hex: "#F08080", name: "LightCoral"},
    {hex: "#E0FFFF", name: "LightCyan"},
    {hex: "#FAFAD2", name: "LightGoldenRodYellow"},
    {hex: "#D3D3D3", name: "LightGray"},
    {hex: "#D3D3D3", name: "LightGrey"},
    {hex: "#90EE90", name: "LightGreen"},
    {hex: "#FFB6C1", name: "LightPink"},
    {hex: "#FFA07A", name: "LightSalmon"},
    {hex: "#20B2AA", name: "LightSeaGreen"},
    {hex: "#87CEFA", name: "LightSkyBlue"},
    {hex: "#778899", name: "LightSlateGray"},
    {hex: "#778899", name: "LightSlateGrey"},
    {hex: "#B0C4DE", name: "LightSteelBlue"},
    {hex: "#FFFFE0", name: "LightYellow"},
    {hex: "#00FF00", name: "Lime"},
    {hex: "#32CD32", name: "LimeGreen"},
    {hex: "#FAF0E6", name: "Linen"},
    {hex: "#FF00FF", name: "Magenta"},
    {hex: "#800000", name: "Maroon"},
    {hex: "#66CDAA", name: "MediumAquaMarine"},
    {hex: "#0000CD", name: "MediumBlue"},
    {hex: "#BA55D3", name: "MediumOrchid"},
    {hex: "#9370DB", name: "MediumPurple"},
    {hex: "#3CB371", name: "MediumSeaGreen"},
    {hex: "#7B68EE", name: "MediumSlateBlue"},
    {hex: "#00FA9A", name: "MediumSpringGreen"},
    {hex: "#48D1CC", name: "MediumTurquoise"},
    {hex: "#C71585", name: "MediumVioletRed"},
    {hex: "#191970", name: "MidnightBlue"},
    {hex: "#F5FFFA", name: "MintCream"},
    {hex: "#FFE4E1", name: "MistyRose"},
    {hex: "#FFE4B5", name: "Moccasin"},
    {hex: "#FFDEAD", name: "NavajoWhite"},
    {hex: "#000080", name: "Navy"},
    {hex: "#FDF5E6", name: "OldLace"},
    {hex: "#808000", name: "Olive"},
    {hex: "#6B8E23", name: "OliveDrab"},
    {hex: "#FFA500", name: "Orange"},
    {hex: "#FF4500", name: "OrangeRed"},
    {hex: "#DA70D6", name: "Orchid"},
    {hex: "#EEE8AA", name: "PaleGoldenRod"},
    {hex: "#98FB98", name: "PaleGreen"},
    {hex: "#AFEEEE", name: "PaleTurquoise"},
    {hex: "#DB7093", name: "PaleVioletRed"},
    {hex: "#FFEFD5", name: "PapayaWhip"},
    {hex: "#FFDAB9", name: "PeachPuff"},
    {hex: "#CD853F", name: "Peru"},
    {hex: "#FFC0CB", name: "Pink"},
    {hex: "#DDA0DD", name: "Plum"},
    {hex: "#B0E0E6", name: "PowderBlue"},
    {hex: "#800080", name: "Purple"},
    {hex: "#663399", name: "RebeccaPurple"},
    {hex: "#FF0000", name: "Red"},
    {hex: "#BC8F8F", name: "RosyBrown"},
    {hex: "#4169E1", name: "RoyalBlue"},
    {hex: "#8B4513", name: "SaddleBrown"},
    {hex: "#FA8072", name: "Salmon"},
    {hex: "#F4A460", name: "SandyBrown"},
    {hex: "#2E8B57", name: "SeaGreen"},
    {hex: "#FFF5EE", name: "SeaShell"},
    {hex: "#A0522D", name: "Sienna"},
    {hex: "#C0C0C0", name: "Silver"},
    {hex: "#87CEEB", name: "SkyBlue"},
    {hex: "#6A5ACD", name: "SlateBlue"},
    {hex: "#708090", name: "SlateGray"},
    {hex: "#708090", name: "SlateGrey"},
    {hex: "#FFFAFA", name: "Snow"},
    {hex: "#00FF7F", name: "SpringGreen"},
    {hex: "#4682B4", name: "SteelBlue"},
    {hex: "#D2B48C", name: "Tan"},
    {hex: "#008080", name: "Teal"},
    {hex: "#D8BFD8", name: "Thistle"},
    {hex: "#FF6347", name: "Tomato"},
    {hex: "#40E0D0", name: "Turquoise"},
    {hex: "#EE82EE", name: "Violet"},
    {hex: "#F5DEB3", name: "Wheat"},
    {hex: "#FFFFFF", name: "White"},
    {hex: "#F5F5F5", name: "WhiteSmoke"},
    {hex: "#FFFF00", name: "Yellow"},
    {hex: "#9ACD32", name: "YellowGreen"}
  ];
  let optionsText = "<option value=null>None</option>";
  for (let color of colorValues){
    optionsText += `<option value="${color.hex}">${color.name}</option>`;
  }

  let dialog = new Promise((resolve, reject) => { 
      new Dialog({
      title: "Dancing Lights Usage",
      content: "Would you like to place 4 individual lights or combine them into a glowing humanoid shape?",
      buttons: {
          one: {
              label: "Lights",
              callback: () => resolve(true)
          },
          two: {
              label: "Humanoid",
              callback: () => {resolve(false)}
          }
      },
      default: "Lights"
    }).render(true);
  });  
  lights = await dialog;

  if(!lights){
    let confirmed = true;
    let dialog = new Promise((resolve, reject) => { 
      new Dialog({
        title: `Placing humanoid shaped light.`,
        content: `
        <div id="color-form-NR" class="form-group">
            <label>Color?</label>
            <div class="form-fields">
                <select name="color">` + optionsText + `</select>
            </div>
        </div>
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
          color = html.find('[name=color]')[0].value;
          console.log(color);
        }
      }).render(true);
    });  
    confirmed = await dialog;
    if (!confirmed){
      return;
    }
    Hooks.once("createMeasuredTemplate", async (template) => {
      const dlSpellParams = {
        x: template.data.x,
        y: template.data.y,
        lightColor: color,
        targetActorId: targetActor.id,
      };
      await DAE.setFlag(targetActor, "dlSpell", dlSpellParams);
      canvas.scene.deleteEmbeddedDocuments("MeasuredTemplate", [template.id]);
      const gmMacro = game.macros.find(m => m.name === gmMacroName);
      gmMacro.execute({state: "on", dlSpellParams});  
    });
    const doc = new CONFIG.MeasuredTemplate.documentClass(measureTemplateData, { parent: canvas.scene });
    const measureTemplate = new game.dnd5e.canvas.AbilityTemplate(doc);
    measureTemplate.actorSheet = targetActor.sheet;
    measureTemplate.drawPreview();
  } else {
    for (let i = 0; i < 4; i++){
      let confirmed = true;
      let dialog = new Promise((resolve, reject) => { 
        new Dialog({
          title: `Placing light ${i+1} out of 4.`,
          content: `
          <div id="color-form-NR" class="form-group">
              <label>Color?</label>
              <div class="form-fields">
                  <select name="color">` + optionsText + `</select>
              </div>
          </div>
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
            color = html.find('[name=color]')[0].value;
            console.log(color);
          }
        }).render(true);
      });  
      confirmed = await dialog;
      if (!confirmed){
        return;
      }
      Hooks.once("createMeasuredTemplate", async (template) => {
        const dlSpellParams = {
          x: template.data.x,
          y: template.data.y,
          lightColor: color,
          targetActorId: targetActor.id,
        };
        await DAE.setFlag(targetActor, "dlSpell", dlSpellParams);
        canvas.scene.deleteEmbeddedDocuments("MeasuredTemplate", [template.id]);
        const gmMacro = game.macros.find(m => m.name === gmMacroName);
        gmMacro.execute({state: "on", dlSpellParams});  
      });
      const doc = new CONFIG.MeasuredTemplate.documentClass(measureTemplateData, { parent: canvas.scene });
      const measureTemplate = new game.dnd5e.canvas.AbilityTemplate(doc);
      measureTemplate.actorSheet = targetActor.sheet;
      measureTemplate.drawPreview();
    }
  }
}

if (args[0] === "off") {
  const dlSpellParams = await DAE.getFlag(targetActor, "dlSpell");
  const gmMacro = game.macros.find(m => m.name === gmMacroName);
  gmMacro.execute({state: "off", dlSpellParams});
  await DAE.unsetFlag(targetActor, "dlSpell");
}
