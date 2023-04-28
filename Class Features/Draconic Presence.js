async function wait(ms) { return new Promise(resolve => { setTimeout(resolve, ms); }); }
const lastArg = args[args.length-1];
console.log(args);

if(lastArg.tag == "OnUse" && lastArg.macroPass == "postActiveEffects"){	
	let type = "fear";
	let dialog = new Promise(async (resolve, reject) => {
		new Dialog({
			title: "Choose a Draconic Presence Type",
			buttons: {
			  fear: {
			    label: "Fear",
			    callback: () => {
			      type = "fear";
			      resolve(true);
			    },
			  },
			  awe: {
			    label: "Awe",
			    callback: () => {
			      type = "awe";
			      resolve(false);
			    },
			  },
			},
		}).render(true);
	});
	confirmed = await dialog;

	const caster = canvas.tokens.get(lastArg.tokenId).actor;
	DAE.setFlag(caster, "Draconic Presence", {immune: [], type: type});
}
else if (args[0] == "on" && !lastArg?.origin?.includes(lastArg.actorUuid)){
	const item = await fromUuid(lastArg.origin);
  	const caster = item.parent;
  	let flag = DAE.getFlag(caster, "Draconic Presence");
  	const target = canvas.tokens.get(lastArg.tokenId).actor;
  	console.log(flag);
  	console.log(target);

  	if (flag.immune.includes(target.uuid)){
  		let effect = target.effects.find(i => i.label === "Draconic Presence");
  		console.log(effect);
  		let changes = duplicate(effect.changes);
  		changes[0].value = changes[0].value.replace('applyCondition=true', 'applyCondition=false');
  		await effect.update({changes});
  	}
}