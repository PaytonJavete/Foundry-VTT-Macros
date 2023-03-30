// This Macro is called by the Wall of Force spell so players can place walls.

const agParams = args[args.length - 1];

if (args[0] == "on") {
  const template = game.settings.get("monks-active-tiles", "tile-templates").find(t => t.name == "Arcane Gate");
  let gate = duplicate(template);
  let topLeft = canvas.grid.getTopLeft(agParams.x, agParams.y);
  gate.x = topLeft[0];
  gate.y = topLeft[1];
  gate.flags.tagger.tags[0] += agParams.targetActorId;
  gate.flags["monks-active-tiles"].actions[0].data.location.id += agParams.targetActorId;
  gate.flags["monks-active-tiles"].actions[0].data.location.name += agParams.targetActorId;
  canvas.scene.createEmbeddedDocuments("Tile", [gate]);
}

if (args[0] == "off") {
  actorId = agParams.targetActorId;
  let agTiles = canvas.tiles.placeables.filter(tile => tile.document.flags?.tagger?.tags[0] == `ArcaneGate${actorId}`);
  const tileArray = agTiles.map((t) => t.id);
  await canvas.scene.deleteEmbeddedDocuments("Tile", tileArray);
}