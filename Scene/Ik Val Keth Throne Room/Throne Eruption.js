async function wait(ms) { return new Promise(resolve => { setTimeout(resolve, ms); }); }

let position = {x: 4600, y:3000};
let offset = {x: 20, y: 20}
let sequence = new Sequence()
    .effect()
        .file("jb2a.explosion.04.dark_red")
        .atLocation(position)
        .size(800)
        .playbackRate(0.8)
    .effect()
        .file("jb2a.impact.ground_crack.dark_red.01")
        .atLocation(position, {offset: offset})
        .rotate(180)
        .size(1000)
        .belowTokens()
    .effect()
        .file("jb2a.ground_cracks.dark_red.01")
        .atLocation(position, {offset: offset})
        .rotate(180)
        .size(1000)
        .fadeIn(3000)
        .belowTokens()
        .persist()
sequence.play();
canvas.lighting.placeables.find(l => l.document.flags?.tagger?.tags[0] == "transition").document.update({"hidden": false});
let lights = canvas.lighting.placeables.filter(l => l.document.flags?.tagger?.tags[0] == "Torch");
for (l of lights) l.document.update({"hidden": true});


await wait(500);

let walls = canvas.walls.placeables.filter(w => w.document?.flags?.tagger?.tags == "Destroy");
const wallArray = walls.map((w) => w.id);
await canvas.scene.deleteEmbeddedDocuments("Wall", wallArray);

let x = 0;
while (x <= 1.0){
    x += 0.1;
    canvas.tiles.placeables[0].document.update({alpha: x});
    await wait(100);
}