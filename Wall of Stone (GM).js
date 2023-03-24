// This Macro is called by the Wall of Force spell so players can place walls.

const wosParams = args[args.length - 1];

async function lineWall(x, y, direction, gridLine){
  theta = Math.toRadians(direction);
  console.log(`Origin coordiantes: (${x}, ${y})`)
  destinationX = Math.floor(x + (Math.cos(theta) * gridLine));
  destinationY = Math.floor(y + (Math.sin(theta) * gridLine));
  console.log(`Destination coordiantes: (${destinationX}, ${destinationY})`)

  let panel = game.actors.getName("Stone Wall");
  let tokenData = [duplicate(panel.prototypeToken)];
  tokenData[0].x = Math.round((x + destinationX)/2 - 100);
  tokenData[0].y = Math.round((y + destinationY)/2 - 50);
  tokenData[0].rotation = direction;
  let wallToken = await canvas.scene.createEmbeddedDocuments("Token", tokenData);
  token = canvas.tokens.get(wallToken[0].id);
  await updatePanelToken(token, panel);

  walls = [];
  walls.push({
    c: [x, y, destinationX, destinationY],
    move: CONST.WALL_MOVEMENT_TYPES.NORMAL,
    light: CONST.WALL_MOVEMENT_TYPES.NORMAL,
    sight: CONST.WALL_MOVEMENT_TYPES.NORMAL,
    sound: CONST.WALL_MOVEMENT_TYPES.NORMAL,
    dir: CONST.WALL_DIRECTIONS.BOTH,
    door: CONST.WALL_DOOR_TYPES.NONE,
    ds: CONST.WALL_DOOR_STATES.CLOSED,
    flags: {
      spellEffects: {
        WoS: {
          ActorId: wosParams.targetActorId,
        },
      },
    },
  });

  canvas.scene.createEmbeddedDocuments("Wall", walls);
}

if (args[0] == "on") {
  if (wosParams.isHorizontal){
    let theta = Math.toRadians(wosParams.direction);
    let destinationX = Math.floor(wosParams.x + (Math.cos(theta) * (0.5 * wosParams.gridLine)));
    let destinationY = Math.floor(wosParams.y + (Math.sin(theta) * (0.5 * wosParams.gridLine)));

    let panel = game.actors.getName("Stone Wall");
    let tokenData = [duplicate(panel.prototypeToken)];

    if (wosParams.isThick){
      tokenData[0].x = destinationX-100;
      tokenData[0].y = destinationY-100;
      tokenData[0].rotation = wosParams.direction - 45;     
    } else {
      tokenData[0].x = destinationX-100;
      tokenData[0].y = destinationY-200;
      tokenData[0].rotation = wosParams.direction + 90; 
    }

    let wallToken = await canvas.scene.createEmbeddedDocuments("Token", tokenData);
    token = canvas.tokens.get(wallToken[0].id);

    if (wosParams.isThick){
      token.document.update({height: 2});
    } else {
      token.document.update({height: 4});
    }
    await updatePanelToken(token, panel);
  }
  else {
    await lineWall(wosParams.x, wosParams.y, wosParams.direction, wosParams.gridLine);
  }
}

if (args[0] == "off") {
  actorId = wosParams.targetActorId
  let wosWalls = canvas.walls.placeables.filter(wall => wall.document.flags?.spellEffects?.WoS.ActorId == actorId);

  let allTokens = canvas.tokens.placeables;
  for (const token of allTokens){
    if (token.document.flags.wos == actorId){
      token.document.delete();
    }
  }

  const wallArray = wosWalls.map((w) => w.id);
  await canvas.scene.deleteEmbeddedDocuments("Wall", wallArray);
}

async function updatePanelToken(token, panel){
    await token.document.update({width: 2});  
    await token.document.update({flags: {wos: wosParams.targetActorId}});
    await token.document.update({img: wosParams.tokenImage});
    await token.document.update({actorId: panel.id});
    await token.document.update({actor: panel});
    if (!wosParams.isThick){
      await token.actor.update({"system.attributes.hp.max": 90});
      await token.actor.update({"system.attributes.hp.value": 90});
    }
}