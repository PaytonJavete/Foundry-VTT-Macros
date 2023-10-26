const lastArg = args[args.length-1];

let templateD = canvas.templates.placeables.find((w) => w.document.flags.dnd5e.origin == lastArg.itemUuid);
let darkness_flags = {
      spellEffects: {
        magicalDark: {
          level: lastArg.castData.castLevel,
        },
      },
      limits: {
        sight: {
          basicSight: { enabled: true, range: 0 }, // Darkvision
          ghostlyGaze: { enabled: true, range: 0 }, // Ghostly Gaze
          lightPerception: { enabled: true, range: 0 }, // Light Perception
        },
        light: { enabled: true, range: 0 },
      },
    };

templateD.document.update({flags: darkness_flags});