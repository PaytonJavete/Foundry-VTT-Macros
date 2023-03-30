(async () => {
async function wait(ms) { return new Promise(resolve => { setTimeout(resolve, ms); }); }
console.log("###### Turning on Hit Detection Scripts ######");
async function hitDetction(workflow){
	console.log("Hit Detection Triggered:");
	console.log(workflow);
	if ()
}
	// 	await workflow.hitTargets.forEach(target => {
	// 		if((target.actor.items.find(i => i.name==="Heavy Armor Master") != null) && (workflow.item.data.type === "weapon") && (!workflow.item.data.data.properties.mgc)){
	// 		    (async () => {
	// 		    let getDamage = await workflow.damageTotal;
	// 			let heavyM = await target.actor.items.find(i => i.name==="Heavy Armor Master");
	// 			let healAmount = Math.min(getDamage, 3);
	// 			await wait(2000);
	// 			await MidiQOL.applyTokenDamage([{damage: healAmount, type: "healing"}], healAmount, new Set([target]), heavyM.name, new Set());
	// 			let heal_html = `<div class="dnd5e chat-card item-card"><header class="card-header flexrow"><img src="${heavyM.data.img}" title="${heavyM.data.name}" width="36" height="36"><h3 class="item-name">${heavyM.data.name}</h3></header><div class="card-content">${heavyM.data.data.description.value}</div><div class="card-buttons"><div class="flexrow 1"><div style="text-align:center">(healing)<div class="dice-roll"><div class="dice-result"><h4 class="dice-total">${healAmount}</h4></div></div></div></div></div></div>`;
	// 			ChatMessage.create({
	// 				user: game.user._id,
	// 				speaker: ChatMessage.getSpeaker({token: target}),
	// 				content: heal_html
	// 			});
	// 		    })();
	// 		}
	// 	});
Hooks.on("midi-qol.RollComplete", hitDetction);
})();