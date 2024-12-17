try {

const lastArg = args[args.length-1];
const item = await fromUuid(lastArg.uuid);
const caster = await fromUuid(lastArg.actor.uuid);
DAE.setFlag(caster, "PrismaticSprayBlind", []);

//roll damage, halve if saved
let damageRoll = await new Roll("10d6").roll();
await game.dice3d.showForRoll(damageRoll);
await ChatMessage.create({ content: `Prismatic Spray Damage: ${damageRoll.total}`});

for (target of lastArg.targets){
    actor = canvas.tokens.get(target.id).actor;
    saved = lastArg.saveUuids.includes(target.uuid);
    
    let damageTotal = saved ? Math.floor(damageRoll.total/2) : damageRoll.total;
    //Check for evasion? (dex super saver)
    if (actor.effects.some(e => e?.changes.some(i => i?.key == "flags.midi-qol.superSaver.dex"))){
    	if (saved) break;
    	else damageTotal = Math.floor(damageTotal/2)
    }
    
    roll = await new Roll("1d8").evaluate({async: true});
    console.log(`Original roll: ${roll.total}`);

    //track if 8 rolled
    let i = 1;
    let multi = false;
    if (roll.total == 8){
    	i = 0;
    	multi = true;
    }
    let types = [];
    let multiRoles = [];
    for (; i < 2; i++){
    	if (multi) roll = await new Roll("1d7").evaluate({async: true});
    	let dieTotal = roll.total;
    	console.log(`Number used in effect selection: ${dieTotal}`);
    	switch (dieTotal){
	    case 1:
	      types.push("fire");
	      break;
	    case 2:
	      types.push("acid");
	      break;
	    case 3:
	      types.push("lightning");
	      break;
	    case 4:
	      types.push("poison");
	      break;
	    case 5:
	      types.push("cold");
	      break;
	    case 6:
	      if (multiRoles.includes(6) || saved) break;
	      multiRoles.push(6);

	      effectData = item.effects.find(effect => effect.label == "Prismatic Spray Petrification");
	      let tracker = {"fails": 1, "saves": 0};
	      DAE.setFlag(actor, "PrismaticSprayPetrify", tracker);
	      await actor.createEmbeddedDocuments('ActiveEffect', [effectData]);

          break;
	    case 7:
	      if (multiRoles.includes(7) || saved) break;
	      multiRoles.push(7);

	      //add blinded to target
	      effectData = item.effects.find(effect => effect.label == "Prismatic Spray Blindness");
	      await actor.createEmbeddedDocuments('ActiveEffect', [effectData]);

	      //effect to track next turn save
	      let casterEffect = duplicate(effectData);
	      casterEffect.changes = [];
	      casterEffect.changes.push({key:"flags.midi-qol.OverTime", mode: 0, priority: 20, value: `label=Prismatic Spray, 
	        turn=start, 
	        macro=Prismatic Spray Blindness`});
	      await caster.createEmbeddedDocuments('ActiveEffect', [casterEffect]);

	      //flag to track who is affected
	      let blindedTokens = DAE.getFlag(caster, "PrismaticSprayBlind");
	      if (!blindedTokens) blindedTokens = [];
	      blindedTokens.push({token: target.id});
	      DAE.setFlag(caster, "PrismaticSprayBlind", blindedTokens);

	      break;
	    }
    }
    
    if (multi && types.length > 1) await MidiQOL.applyTokenDamage([{ damage: damageTotal, type: types[0] }, { damage: damageTotal, type: types[1] }], (2*damageTotal), new Set([target]), item, new Set());
    else if (types.length > 0) await MidiQOL.applyTokenDamage([{ damage: damageTotal, type: types[0] }], damageTotal, new Set([target]), item, new Set());
}

} catch (err) {
    console.error("Prismatic Spray", err);
}