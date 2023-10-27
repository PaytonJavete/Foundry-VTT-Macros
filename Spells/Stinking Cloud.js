AAhelpers.applyTemplate(args);

const lastArg = args[args.length - 1];
let templateM = canvas.templates.placeables.find((w) => w.document.flags.dnd5e.origin == lastArg.itemUuid);
let HO_flags = {
      limits: {
        sight: {
          basicSight: { enabled: true, range: 0 }, // Darkvision
          lightPerception: { enabled: true, range: 0 }, // Light Perception
        },
        light: { enabled: true, range: 0 },
      },
    };
templateM.document.update({flags: HO_flags});

let size = canvas.grid.size * ((templateM.document.distance*2.5) / canvas.dimensions.distance);
new Sequence()
  .effect()
    .file("jb2a.fog_cloud.02.green02")
    .persist()
    .aboveLighting()
    .origin(lastArg.itemUuid)
    .atLocation(templateM)
    .size({width: size, height: size})
  .play()