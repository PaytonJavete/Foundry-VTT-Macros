//##############################################################################################################################
// Call Macro
// - Under item 'Details'
// - On Use Macros : After Active Effects
// Variables (search and replace)
// - RANGE : range of telportation
// - NAME : name of ability
// - START_EFFECT : animation at original location
// - END_EFFECT : animation at target location
//##############################################################################################################################

const lastArg = args[args.length - 1];
const sourceToken = await fromUuid(lastArg.tokenUuid);
const tokenWidth = sourceToken.data.width;

if (game.user.targets.size != 1) return ui.notifications.error("Bend Space can only have one target.");
const target = await fromUuid(lastArg.targetUuids[0]);

let sourcePos = canvas.grid.getTopLeft(sourceToken.x, sourceToken.y);
let targetPos = canvas.grid.getTopLeft(target.x, target.y);

let centerTarget = canvas.grid.getCenter(target.x, target.y);
let tokenCenter = canvas.grid.getCenter(sourceToken.x, sourceToken.y);
let offset = (tokenWidth-1) * (canvas.grid.size / 2);

let aaSeq = new Sequence();

// Start Animation
let startEffect = aaSeq.effect()
startEffect.file('jb2a.whirlwind.purple')
startEffect.duration(2000)
startEffect.atLocation({x: tokenCenter[0]+offset, y: tokenCenter[1]+offset})    
startEffect.size(tokenWidth * 1.5, { gridUnits: true })

// End Animation
let endEffect = aaSeq.effect()
endEffect.file('jb2a.whirlwind.purple')
endEffect.duration(2000)
endEffect.atLocation({ x: centerTarget[0]+offset, y: centerTarget[1]+offset })
endEffect.size(tokenWidth * 1.5, { gridUnits: true })

// Move Token
let moveSource = aaSeq.animation()
moveSource.on(sourceToken)
moveSource.teleportTo({ x: targetPos[0], y: targetPos[1] })

let moveTarget = aaSeq.animation()
moveTarget.on(target)
moveTarget.teleportTo({ x: sourcePos[0], y: sourcePos[1] })

aaSeq.play()