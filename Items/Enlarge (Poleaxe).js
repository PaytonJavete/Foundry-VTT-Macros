let tokenM = canvas.tokens.get(args[1].tokenId);
let actorM = tokenM.actor;
let originalSize = tokenM.document.width;

if (args[0] === "on") {
    let enlarge = (originalSize + 1);
    await tokenM.document.update({ "width": enlarge, "height": enlarge });
    await DAE.setFlag(actorM, 'enlargeReduceSpell', {
        size: originalSize,
    });
    await ChatMessage.create({ content: `${tokenM.name} is enlarged` });
}

if (args[0] === "off") {
    let flag = DAE.getFlag(actorM, 'enlargeReduceSpell');
    await tokenM.document.update({ "width": flag.size, "height": flag.size });
    await DAE.unsetFlag(actorM, 'enlargeReduceSpell');
    await ChatMessage.create({ content: `${tokenM.name} is returned to normal size` });
}