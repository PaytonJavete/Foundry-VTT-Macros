/*
 * The Smite macro emulates the Divine Smite feature of Paladins in DnD 5e. A spell slot level to use
 * can be selected, which increases the number of damage dice, and smiting a fiend or undead
 * will also increase the number of damage dice.
 * 
 * If a token is not selected, the macro will default back to the default character for the Actor. 
 * This allows for the GM to cast the macro on behalf a character that possesses it, 
 * without requiring that a PC have their character selected.
 * To execute the macro a target MUST be specified and, unless configured otherwise, the character must have an available spell slot. 
 * Make your regular attack and then if you choose to use Divine Smite, run this macro.
 */
//Check to see if is melee attack
if (!["mwak"].includes(args[0].itemData.system.actionType)) return {};
if (args[0].hitTargets.length < 1) return {};


//Configurable variables
let maxSpellSlot = 5; //  Highest spell-slot level that may be used.
let affectedCreatureTypes = ["fiend", "undead", "undead (shapechanger)"]; //  Creature types that take extra damage.

// Use token attack is coming from.
token = canvas.tokens.get(args[0].tokenId);
s_actor = token.actor;    

// Flag for selected slot type
let slotLevel = 0;
let consumeSlot = true;

// Verifies if the actor can smite.
if (s_actor?.items.find(i => i.name === "Divine Smite") === undefined){
    return ui.notifications.error(`No valid actor selected that can use this macro.`);
}

// Check is slots available
if (!hasAvailableSlot(s_actor)) return ui.notifications.error(`No spell slots available to use this feature.`);

// Get options for available slots
let optionsText = "";
let i = 1;
for (; i < maxSpellSlot; i++) {
    const slots = s_actor.system.spells[`spell${i}`];
    if (slots.value > 0) {
        const level = CONFIG.DND5E.spellLevels[i];
        const label = game.i18n.format('DND5E.SpellLevelSlot', {level: level, n: slots.value});
        optionsText += `<option value="${i}">${label}</option>`;
    }
}

// Create a dialogue box to select spell slot level to use when smiting.
let confirmed = false;
let dialog = new Promise(async (resolve, reject) => {
    new Dialog({
    title: "Divine Smite: Usage Configuration",
    content: `
    <form id="smite-use-form">
        <p>` + game.i18n.format("DND5E.AbilityUseHint", {name: "Divine Smite", type: "feature"}) + `</p>
        <div class="form-group">
            <label>Spell Slot Level</label>
            <div class="form-fields">
                <select name="slot-level">` + optionsText + `</select>
            </div>
        </div>

        <div class="form-group">
            <label class="checkbox">
            <input type="checkbox" name="consumeCheckbox" checked/>` + game.i18n.localize("DND5E.SpellCastConsume") + `</label>
        </div>
    </form>
    `,
    buttons: {
        one: {
            icon: '<i class="fas fa-check"></i>',
            label: "SMITE!",
            callback: () => resolve(true)
        },
        two: {
            icon: '<i class="fas fa-times"></i>',
            label: "Cancel",
            callback: () => {resolve(false)}
        }
    },
    default: "Cancel",
    close: html => {
        slotLevel = parseInt(html.find('[name=slot-level]')[0].value);   
        consumeSlot = html.find('[name=consumeCheckbox]')[0].checked;
        resolve();
    }
  }).render(true);
});
confirmed = await dialog;

if(!confirmed) return;

const damageMult = args[0].isCritical ? 2: 1;
let targets = game.user.targets;

let chosenSpellSlots = s_actor.system.spells[`spell${slotLevel}`];

if (chosenSpellSlots.value < 1) {
    ui.notifications.error("No spell slots of the required level available.");
    return;
}

const [target] = targets;
let numDice = (slotLevel + 1) * damageMult;
let type = target.actor.system.details.type.value?.toLocaleLowerCase();
if (affectedCreatureTypes.includes(type)) numDice += 1;

if (consumeSlot){
    let objUpdate = new Object();
    objUpdate['system.spells.spell' + slotLevel + '.value'] = chosenSpellSlots.value - 1;
    s_actor.update(objUpdate);
}

// Divine Smite Animation
new Sequence()
      .effect()
        .atLocation(token)
        .file("modules/JB2A_DnD5e/Library/2nd_Level/Divine_Smite/DivineSmite_01_Regular_BlueYellow_Caster_400x400.webm")
      .waitUntilFinished()
      .effect()
        .atLocation(target)
        .file("modules/JB2A_DnD5e/Library/2nd_Level/Divine_Smite/DivineSmite_01_Regular_BlueYellow_Target_400x400.webm")
      .play();

return {damageRoll: `${numDice}d8[radiant]`, flavor: "Divine smite"};

/**
 * Returns whether the actor has any spell slot left.
 * @param {Actor5e} actor - the actor to get slot information from.
 * @returns {boolean} True if any spell slots of any spell level are available to be used.
 */
 function hasAvailableSlot(actor) {
    for (let slot in actor.system.spells) {
        if (actor.system.spells[slot].value > 0) {
            return true;
        }
    }
    return false;
 }