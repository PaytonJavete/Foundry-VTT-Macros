let attackers = canvas.tokens.controlled;
let statblock = attackers[0].actor;

let id = statblock.id;
for (a of attackers){
	if (a.actor.id != id) return ui.notifications.error("Not all selected attackers use the same stat block");
}

const weapons = statblock.items.filter((i) => i.type === "weapon");
const weaponContent = weapons.map((w) => `<option value=${w.id}>${w.name}</option>`).join("");

let confirmed = false;
let itemId = null;
let dialog = new Promise((resolve, reject) => { 
    new Dialog({
    title: "What do they attack with?",
    content: `
		<div class="form-group">
		 <label>Weapons : </label>
		 <select name="weapons">
		 ${weaponContent}
		 </select>
		</div>
		`,
    buttons: {
        one: {
            icon: '<i class="fas fa-check"></i>',
            label: "Attack!",
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
        itemId = html.find("[name=weapons]")[0].value;
    }
  }).render(true);
});
confirmed = await dialog;

if(!confirmed || itemId == null) return;

const item = statblock.getEmbeddedDocument("Item", itemId);
const weaponCopy = duplicate(item);
weaponCopy.system.attackBonus = Number(weaponCopy.system.attackBonus) + Number(statblock.system.attributes.prof); //CONFIG.Item.documentClass for some reason does not add prof
const options = { showFullCard: true, createWorkflow: true, versatile: false, configureDialog: false };

let damage = 0
for (attacker of attackers){
	let current = attacker.actor;
	weaponItem = new CONFIG.Item.documentClass(weaponCopy, { parent: current })
	result = await MidiQOL.completeItemRoll(weaponItem, options);
	if (result?.damageList != undefined) damage += result.damageList[0].appliedDamage;
}

ChatMessage.create({
user: game.user._id,
speaker: ChatMessage.getSpeaker({token: actor}),
content: `Total Damage: ${damage}`
});