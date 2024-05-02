let canvasDrawings = canvas.drawings.placeables.filter(d => d.document.flags.silentStatue);
if (canvasDrawings.length == 2){
  const drawingArray = canvasDrawings.map((d) => d.id);
  await canvas.scene.deleteEmbeddedDocuments("Drawing", drawingArray);
  AAhelpers.UserCollateAuras(canvas.scene.id, true, false, "refresh");

  let lights = canvas.lighting.placeables.filter(l => l.document.flags?.tagger?.tags[0] == "Statue");
  for (l of lights) l.document.update({"hidden": true});
} else {
  let shapeD = {
          type: "p",
          width: 600,
          height: 1200,
          radius: null,
          points: [
              300,
              1200,
              0,
              600,
              300,
              0,
              600,
              600,
              300,
              1200
          ]
      };

  const drawingLeft = {
      shape: shapeD,
      x: 5800,
      y: 2400,
      hidden: true,
      locked: true,
      flags: {
        silentStatue: true
      }
  }

  const drawingRight = {
      shape: shapeD,
      x: 6600,
      y: 2400,
      hidden: true,
      locked: true,
      flags: {
        silentStatue: true
      }
  }

  let drawings  = [];
  const docL = new CONFIG.Drawing.documentClass(drawingLeft, { parent: canvas.scene });
  drawings.push(docL);
  const doR = new CONFIG.Drawing.documentClass(drawingRight, { parent: canvas.scene });
  drawings.push(doR);
  await canvas.scene.createEmbeddedDocuments("Drawing", drawings);

  let lights = canvas.lighting.placeables.filter(l => l.document.flags?.tagger?.tags[0] == "Statue");
  for (l of lights) l.document.update({"hidden": false});

  //add effect
  const effectData = game.dfreds.effectInterface.findEffectByName('Silenced').data;
  let canvasDrawings = canvas.drawings.placeables.filter(d => d.document.flags.silentStatue);
  await AAHelpers.applyDrawing(canvasDrawings[0], [effectData]);
  await AAHelpers.applyDrawing(canvasDrawings[1], [effectData]);
}