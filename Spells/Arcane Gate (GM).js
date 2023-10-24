// This Macro is called by the Wall of Force spell so players can place walls.
/* 
Parameters passed:
  - state: ["on" or "off"]
  - agSpellParams: {
    - x: template.x,
    - y: template.y,
    - targetActorId: targetActor.id,  
  }
 */


if (state == "on") {
  const template = game.settings.get("monks-active-tiles", "tile-templates").find(t => t.name == "Arcane Gate");
  let gate = duplicate(template);
  let topLeft = canvas.grid.getTopLeft(agSpellParams.x, agSpellParams.y);
  gate.x = topLeft[0];
  gate.y = topLeft[1];
  gate.flags.tagger.tags[0] += agSpellParams.targetActorId;
  gate.flags["monks-active-tiles"].actions[0].data.location.id += agSpellParams.targetActorId;
  gate.flags["monks-active-tiles"].actions[0].data.location.name += agSpellParams.targetActorId;
  canvas.scene.createEmbeddedDocuments("Tile", [gate]);
}

if (state == "off") {
  actorId = agSpellParams.targetActorId;
  let agTiles = canvas.tiles.placeables.filter(tile => tile.document.flags?.tagger?.tags[0] == `ArcaneGate${actorId}`);
  const tileArray = agTiles.map((t) => t.id);
  await canvas.scene.deleteEmbeddedDocuments("Tile", tileArray);
}