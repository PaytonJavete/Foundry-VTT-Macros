const actor = canvas.tokens.controlled[0].actor;

// Get options for missing spell slots, and spell level 5 or less
let spellOptionsText = "";
for (i = 3; i <= 9; i++) {
    const slots = actor.system.spells[`spell${i}`];
    if (slots.max > 0) {
        const level = CONFIG.DND5E.spellLevels[i];
        const label = game.i18n.format('DND5E.SpellLevelSlot', {level: level, n: `${slots.value}/${slots.max}`});
        spellOptionsText += `<option value="${i}">${label}</option>`;
    }
}


let effectOptionsText = "<option value='Ability'>Choose one ability score. While cursed, the target has disadvantage on ability checks and saving throws made with that ability score.</option>";
effectOptionsText += "<option value='Attacks'>While cursed, the target has disadvantage on attack rolls against you.</option>";
effectOptionsText += "<option value='Disoriented'>While cursed, the target must make a Wisdom saving throw at the start of each of its turns. If it fails, it wastes its action that turn doing nothing.</option>";
effectOptionsText += "<option value='Necrotic'>While the target is cursed, your attacks and spells deal an extra 1d8 necrotic damage to the target.</option>";
effectOptionsText += "<option value='Custom'>Your own custom curse, check with the DM first.</option>";

let level = 3;
let effect = "";
let confirmed = false;
let dialog = new Promise(async (resolve, reject) => {
    new Dialog({
        title: "Bestow Curse",
        content: `
        <form id="BC-use-form" name="Bestow Curse Dialog Window">
            <p>` + game.i18n.format("DND5E.AbilityUseHint", {name: "Bestow Curse", type: "spell"}) + `</p>
                <div id="spell-form-BC" class="form-group">
                    <label>Spell Slot</label>
                    <div class="form-fields">
                        <select name="spell-level">` + spellOptionsText + `</select>
                    </div>
                </div>
                <div id="effect-form-BC" class="form-group">
                    <label>Effect</label>
                    <div class="form-fields">
                        <select name="effect">` + effectOptionsText + `</select>
                    </div>
                </div>
        </form>
        `,
        buttons: {
            one: {
                icon: '<i class="fas fa-check"></i>',
                label: "Confirm",
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
            level = parseInt(html.find('[name=spell-level]')[0].value);
            effect = html.find('[name=effect]')[0].value;
        }
    }).render(true);
});
confirmed = await dialog;
if(!confirmed) return;

const item = actor.items.getName("Bestow Curse");
const workflowItemData = duplicate(item);

workflowItemData.system.level = level;
if (level == 4){
    workflowItemData.system.duration = {units: "minute", value: 10};
} else if (level == 5 || level == 6){
    workflowItemData.system.duration = {units: "hour", value: 8};
    workflowItemData.system.components.concentration = false;
} else if (level == 7 || level == 8){
    workflowItemData.system.duration = {units: "hour", value: 24};
    workflowItemData.system.components.concentration = false;  
} else if (level == 9){
    workflowItemData.system.duration = {units: "perm", value: ""};
    workflowItemData.system.components.concentration = false;
}

const effectData = workflowItemData.effects.find(effect => effect.name == "Bestow Curse");
if (effect == "Ability"){
    let ability = "";
    let abilityOptionsText = "<option value='str'>Strength</option>";
    abilityOptionsText += "<option value='dex'>Dexterity</option>";
    abilityOptionsText += "<option value='con'>Constitution</option>";
    abilityOptionsText += "<option value='int'>Intelligence</option>";
    abilityOptionsText += "<option value='wis'>Wisdom</option>";
    abilityOptionsText += "<option value='cha'>Charisma</option>";
    let stopper = false;
    let abilityDialog = new Promise(async (resolve, reject) => {
        new Dialog({
            title: "Bestow Curse: Abiltiy Curse",
            content: `
            <form id="BC-use-form" name="Bestow Curse Dialog Window">
                <p>` + game.i18n.format("DND5E.AbilityUseHint", {name: "Bestow Curse", type: "spell"}) + `</p>
                    <div id="spell-form-BC" class="form-group">
                        <label>Ability</label>
                        <div class="form-fields">
                            <select name="ability">` + abilityOptionsText + `</select>
                        </div>
                    </div>
            </form>
            `,
            buttons: {
                one: {
                    icon: '<i class="fas fa-check"></i>',
                    label: "Confirm",
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
                ability = html.find('[name=ability]')[0].value;
            }
        }).render(true);
    });
    stopper = await abilityDialog;

    effectData.changes.push({key:`flags.midi-qol.disadvantage.ability.save.${ability}`, mode: 0, priority: 20, value: "1"});
    effectData.changes.push({key:`flags.midi-qol.disadvantage.ability.check.${ability}`, mode: 0, priority: 20, value: "1"});
} else if (effect == "Attacks"){
    //Seems there is not much support disadvantage on all attacks against one target
} else if (effect == "Disoriented"){
    effectData.changes.push({key:"flags.midi-qol.OverTime", mode: 0, priority: 20, value: `label=Curse, 
        turn=start, 
        saveAbility=wis, 
        saveDC=${actor.system.attributes.spelldc}, 
        saveMagic=true, 
        saveRemove=false`});
} else if (effect == "Necrotic"){
    const casterEffect = duplicate(effectData);
    casterEffect.changes.push({key:"flags.dnd5e.DamageBonusMacro", mode: 0, priority: 20, value: "ItemMacro"});
    selfDur = 60;
    if (level == 4){
        selfDur = 60 * 10;
    } else if (level == 5 || level == 6){
        selfDur = 8 * 3600;
    } else if (level == 7 || level == 8){
        selfDur = 24 * 3600;
    } else if (level == 9){
        selfDur = null;
    }
    casterEffect.duration.seconds = selfDur;
    await actor.createEmbeddedDocuments('ActiveEffect', [casterEffect]);

    effectData.changes.push({key:"flags.dae.onUpdateSource", mode: 0, priority: 20, value: "Bestow Curse"});   
} else if (effect == "Custom"){
    // Manually change the effect
}
effectData.label = "Cursed";
setProperty(workflowItemData, "effects", [effectData]);

const spellItem = new CONFIG.Item.documentClass(workflowItemData, { parent: actor });
const options = { showFullCard: false, createWorkflow: true, configureDialog: false };
await MidiQOL.completeItemRoll(spellItem, options); 