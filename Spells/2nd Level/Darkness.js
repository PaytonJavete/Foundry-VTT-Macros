const lastArg = args[args.length-1];

let templateD = canvas.templates.placeables.find((w) => w.document.flags.dnd5e.origin == lastArg.itemUuid);
let darkness_flags = {
      spellEffects: {
        magicalDark: {
          level: lastArg.castData.castLevel,
        },
      },
    };
templateD.document.update({flags: darkness_flags});

let params = {template: {x: templateD.x, y: templateD.y, uuid: templateD.document.uuid}, light_P: {dim: 0, bright: 15, color: null, darkness: true}};
const gmMacro = game.macros.find(m => m.name === "Attach Light to Template");
gmMacro.execute(params);