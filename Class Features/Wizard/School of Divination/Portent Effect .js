console.log(args);
if (args[0] === "on"){
	let attackHook = Hooks.on("midi-qol.preAttackRoll", async (workflow) => {
		if (workflow.actor.effects.some(e => e.name.includes("Portent"))){
			const portentRoll = workflow.actor.flags.dae.NextPortent;
			const profBonus = workflow.item.system.prof._baseProficiency * workflow.item.system.prof.multiplier;
		    const abilityBonus = workflow.actor.system.abilities[`${workflow.item.system.ability}`].mod;
		    const magicBonus = workflow.item.system.magicalBonus == null ? 0 : workflow.item.system.magicalBonus;
		    const miscBonus = workflow.actor.system.bonuses[`${workflow.item.system.actionType}`].attack;
		    const weaponBonus = workflow.item.system.attack.bonus == '' ? 0 : workflow.item.system.attack.bonus;
		    let bonus = profBonus + abilityBonus + magicBonus + Number(miscBonus) + Number(weaponBonus);
		    if (workflow.item.system.attack.flat) bonus = Number(weaponBonus);
			const uuid = workflow.actor.uuid;
			const effectData = game.dfreds.effectInterface.findEffect({ effectName: 'Portent Attack' }).toObject();
			for (effect of effectData.changes){
			    if (effect.value == "reroll"){
					if (portentRoll == 20){
						effect.value = 'reroll-max';
					} else if (portentRoll == 1){
						effect.value = 'reroll-min';
					} else {
						effect.value = `replace 1d20min${portentRoll}max${portentRoll} + ${bonus}`;
					}		       
			    }
			}
			await game.dfreds.effectInterface.addEffect({ effectData, uuid });
		}
	    Hooks.off("midi-qol.preAttackRoll", attackHook); 
	});
}