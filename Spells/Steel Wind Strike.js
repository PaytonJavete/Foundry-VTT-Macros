const lastArg = args[args.length - 1];
const [target] = lastArg.targets;
const sourceToken = await fromUuid(lastArg.tokenUuid);

const userColor = game.user?.color ? "0x" + game.user.color.replace(/^#/, '') : 0x0D26FF;
const range = 5;
const tokenWidth = sourceToken.data.width;
let startX = sourceToken.x;
let startY = sourceToken.y;

let aaSeq01 = await new Sequence()
aaSeq01.effect()
    .file("modules/autoanimations/animationPNG/teleportCircle.png")
    .atLocation(target)
    .size(((tokenWidth / canvas.grid.size) + 0.5 + (range / canvas.dimensions.distance)) * 2, { gridUnits: true })
    .fadeIn(500)
    .scaleIn(0, 500)
    .fadeOut(500)
    .name("teleportation - Steel Wind Strike")
    .persist(true)
    .filter("Glow", {
        distance: 10,
        outerStrength: 5,
        innerStrength: 5,
        color: userColor,
        quality: 0.2,
    })
aaSeq01.play()

let pos;
canvas.app.stage.addListener('pointerdown', event => {
    if (event.data.button !== 0) { return }
    pos = event.data.getLocalPosition(canvas.app.stage);

    let topLeft = canvas.grid.getTopLeft(pos.x, pos.y);
    targetAdjacent = canvas.grid.measureDistance({ x: target.x, y: target.y}, { x: topLeft[0], y: topLeft[1] }, { gridSpaces: true }) <= range;

    if (targetAdjacent) {
        deleteTemplatesAndMove();
        canvas.app.stage.removeListener('pointerdown');
    }
});

async function deleteTemplatesAndMove() {
    let gridPos = canvas.grid.getTopLeft(pos.x, pos.y);
    let centerPos = canvas.grid.getCenter(pos.x, pos.y);
    let tokenCenter = canvas.grid.getCenter(startX, startY);
    let offset = (tokenWidth-1) * (canvas.grid.size / 2);

    Sequencer.EffectManager.endEffects({ name: "teleportation" })

    let aaSeq = new Sequence();

    // Start Animation
    let startEffect = aaSeq.effect()
    startEffect.file("jb2a.side_impact.part.smoke.blue.01")
    startEffect.atLocation({x: tokenCenter[0]+offset, y: tokenCenter[1]+offset})    
    startEffect.size(tokenWidth * 1.5, { gridUnits: true })

    // End Animation
    let endEffect = aaSeq.effect()
    endEffect.file("jb2a.sneak_attack.blue")
    endEffect.atLocation({ x: centerPos[0]+offset, y: centerPos[1]+offset })
    endEffect.size(tokenWidth * 1.5, { gridUnits: true })

    // Move Token
    let animSeq = aaSeq.animation()
    animSeq.on(sourceToken)
    animSeq.teleportTo({ x: gridPos[0], y: gridPos[1] })

    aaSeq.play()
};