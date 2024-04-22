const throne = canvas.tokens.placeables.find(t => t.document.name == "Rokvin's Throne");
const range = 60;
const undeadTokens = canvas.tokens.placeables.filter(t => MidiQOL.getDistance(throne, t, false, false) <= range && t.actor.system.details.type.value == "undead");
const livingTokens = canvas.tokens.placeables.filter(t => MidiQOL.getDistance(throne, t, false, false) <= range && t.actor.system.details.type.value != "undead" && t.actor.system.details.type.custom != "object");

let position = {x: 4600, y:3000};
let offset = {x: 20, y: 20}
let sequence = new Sequence()
    .effect()
        .file("jb2a.toll_the_dead.grey.shockwave")
        .atLocation(position)
        .size(2500)
        .playbackRate(0.8);
sequence.play();

totalDamage = await new Roll("3d6").evaluate({ async: true });

await MidiQOL.applyTokenDamage([{ damage: totalDamage.total, type: "necrotic" }], totalDamage.total, new Set(livingTokens), undefined, new Set());

await MidiQOL.applyTokenDamage([{ damage: totalDamage.total, type: "healing" }], totalDamage.total, new Set(undeadTokens), undefined, new Set());