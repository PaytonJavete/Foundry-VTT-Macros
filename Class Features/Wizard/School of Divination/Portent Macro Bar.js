//////////////////............How does this work?.............//////////////////////
// You as the GM have to check the itemName is correct in this macro. (see main function)
// The player clicks the macro and on first run it will only give the button refresh
// this will set the dice for the first time. CLicking the macro again will allow the
// player to use the dice set by the macro. It is then upto the DM and player on how
// to interpret this number. Since there are too many use cases to capture at once.
//
// Gallery: https://imgur.com/a/PYpMbUy
//
// Requires v10 and DnD 5e v2.0.3+

const itemName = "Portent"                                                    // set this string to what the Portent feature item is called in your game.
const wizardActor = game.user.character || token.actor; //second option is for the GM.
const portentItem = wizardActor.items.find(i => i.name.includes(itemName)); // finds that item name.

if(!portentItem) return ui.notifications.warn("Your actor does not have the Portent feature");
let myButtons = await generateButtons(wizardActor, portentItem, itemName); // creates the buttons, see function below.
new Dialog({
    title: "Divination Wizard's Portent",
    content: "Make a choice",
    buttons: myButtons,
}).render(true);

async function generateButtons(macroActor, item, itemName){
    let portentRolled = await macroActor.getFlag("world","portent"); // does the character already have a set of buttons
    let diceNumber = macroActor.items.getName("Wizard").system.levels < 14 ? 2 : 3; //sets up for Greater Portent where the player gets 3 dice at level 14.
    let myButtons = {};
    if (portentRolled !== undefined){
        myButtons = portentRolled.reduce((buttons, roll) => {
            let msgContent = `I forsaw this event and choose to roll: <b>${roll}</b>`;
            buttons[roll] = {
                label: `Roll: ${roll}`,
                callback: async () => {
                    if (game.user.targets.size != 1) return ui.notifications.warn("Portent must target 1 creature");
                    ChatMessage.create({content:`<div class="dnd5e chat-card">
                                                    <header class="card-header flexrow">
                                                        <img src="${item.img}" title="${item.name}" width="36" height="36" />
                                                        <h3 class="item-name">${item.name}:</h3>
                                                    </header></div>` + msgContent, speaker:{alias: macroActor.name}});
                    portentRolled.splice(portentRolled.indexOf(roll), 1); // removes the used value from the array.
                    await macroActor.setFlag("world", "portent", portentRolled); // sets the new array as the flag value
                    await item.update({name: `${itemName} [${portentRolled}]`});  // updates the item name to contain the new array.
                    const targetActor = await game.user.targets.first().actor;
                    const uuid = targetActor.uuid;
                    const effectData = game.dfreds.effectInterface.findEffect({ effectName: 'Portent' }).toObject();
                    for (effect of effectData.changes){
                        if (effect.key == "macro.execute") break;
                        effect.value = roll;
                    }
                    await game.dfreds.effectInterface.addEffect({ effectData, uuid });
                    await DAE.setFlag(targetActor, "NextPortent", roll);
                    let value = wizardActor.system.resources.secondary.value - 1;
                    wizardActor.update({"system.resources.secondary.value": value});
                }
            };
            return buttons;
        }, {});
    }
    myButtons.reset = {
        label: "Refresh, new day",
        callback: async () => {
            let portentRolls = [];
            let msgContent = "";
            let i = 1; // roll counter
            let myRoll = await new Roll(`${diceNumber}d20`).evaluate(); // rolling the new dice
            for(let result of myRoll.terms[0].results){
                portentRolls.push(result.result); // adding the result to the array.
                msgContent += `Roll ${i} - <b>${result.result}</b></br>`; // preps part of the chat message content
                i++;
            }
            await macroActor.setFlag("world", "portent", portentRolls); // sets a fresh array of 2 or 3 d20s 
            await item.update({name: `${itemName} [${portentRolls}]`})
            ChatMessage.create({content: `<div class="dnd5e chat-card">
                                            <header class="card-header flexrow">
                                            <img src="${item.img}" title="${item.name}" width="36" height="36" />
                                            <h3 class="item-name">${item.name}:</h3>
                                        </header></div>
                                            My portent forsees the following outcomes:</br>` + msgContent, speaker:{alias: macroActor.name}});
        }

    };
    return myButtons;
}