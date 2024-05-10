/*
    Options: keys for entries in game.collections
*/

//Example
const collectionName = "Item";
const item = "Aid";
const changes = {name: "Aid-Test"};
game.collections.get(collectionName).getName(item).update(changes);

//Update targetFolder example
game.collections.get("Item").getName("Aid").update({targetFolder: game.collections.get("Folder").getName("9th Level")})

//Push spell to actors
const spellName = "Sanctuary";
const actors = game.actors.filter(a => a.items.some(i => i.name == spellName));
console.log(actors);

for (actor of actors){
  console.log(actor);
  currentItem = actor.items.find(i => i.name == spellName);
  newItem = duplicate(game.items.find(i => i.name == spellName));
  newItem.system.uses = currentItem.system.uses;
  newItem.system.preparation = currentItem.system.preparation;
  newItem.system.consume = currentItem.system.consume;
  await actor.deleteEmbeddedDocuments("Item", [currentItem.id]);
  await actor.createEmbeddedDocuments("Item", [newItem]); 
}

//Update Spells
const spells = game.collections.get("Item").filter(i => i.type === "spell");

//Update Folders
for (const spell of spells){
  level = spell.system.level;
  let targetFolder = undefined;
  switch (level){
    case 0:
      targetFolder = game.collections.get("Folder").getName("Cantrip");
      break;
    case 1:
      targetFolder = game.collections.get("Folder").getName("1st Level");
      break;
    case 2:
      targetFolder = game.collections.get("Folder").getName("2nd Level");
      break;
    case 3:
      targetFolder = game.collections.get("Folder").getName("3rd Level");
      break;
    case 4:
      targetFolder = game.collections.get("Folder").getName("4th Level");
      break;
    case 5:
      targetFolder = game.collections.get("Folder").getName("5th Level");
      break;
    case 6:
      targetFolder = game.collections.get("Folder").getName("6th Level");
      break;
    case 7:
      targetFolder = game.collections.get("Folder").getName("7th Level");
      break;
    case 8:
      targetFolder = game.collections.get("Folder").getName("8th Level");
      break;
    case 9:
      targetFolder = game.collections.get("Folder").getName("9th Level");
      break;
  }
  if (!targetFolder){
    ui.notifications.warn(`No targetFolder available found for ${spell.name}`)
    break;
  }

  spell.update({folder: targetFolder});
}

//Gradient Effect in Folder Colors
const targetFolders = game.collections.get("Folder").getName("Spells").children;
const num = targetFolders.length-1;
const startColor = [255, 122, 242];
const targetColor = [14, 0, 168];
const redInc = (startColor[0] - targetColor[0]) / num;
const greenInc = (startColor[1] - targetColor[1]) / num;
const blueInc = (startColor[2] - targetColor[2]) / num;

let step = 0;
for (t of targetFolders){
  thisRed = startColor[0] - Math.floor(redInc*step);
  thisGreen = startColor[1] - Math.floor(greenInc*step);
  thisBlue = startColor[2] - Math.floor(blueInc*step);
  redStr = thisRed.toString(16);
  while (redStr.length < 2) { redStr = '0' + redStr; } // Zero pad.
  greenStr = thisGreen.toString(16);
  while (greenStr.length < 2) { greenStr = '0' + greenStr; } // Zero pad.
  blueStr = thisBlue.toString(16);
  while (blueStr.length < 2) { blueStr = '0' + blueStr; } // Zero pad.
  hexStr = '#' + redStr + greenStr + blueStr;
  t.folder.update({color: hexStr});
  step += 1;
}