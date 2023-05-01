let actor = game.actors.get(args[1].actorId);
let token = canvas.tokens.get(args[1].tokenId);
let originalSize = token.data.width;
let mwak = actor.system.bonuses.mwak.damage;

if (args[0] === "on") {
    let enlarge = (originalSize + 1);
    await token.document.update({ "width": enlarge, "height": enlarge });
    await DAE.setFlag(actor, 'enlageReduceSpell', {
        size: originalSize,
    });
}

if (args[0] === "off") {
    let flag = DAE.getFlag(actor, 'enlageReduceSpell');
    await token.document.update({ "width": flag.size, "height": flag.size });
    await DAE.unsetFlag(actor, 'enlageReduceSpell');
}