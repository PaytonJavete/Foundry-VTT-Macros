const caster = await fromUuid(lastArg.actor.uuid);
const saveDC = caster.system.attributes.spelldc;

let blindedTokens = DAE.getFlag(caster, "PrismaticSprayBlind");

let result = await game.MonksTokenBar.requestRoll(blindedTokens,{request:[{"type":"save","key":"wis","count":1}], 
	dc:saveDC, silent:true, fastForward:true, flavor:"Prismatic Spray", rollMode:'gmroll', async: true});

for (token of result.tokenresults){
	token = canvas.tokens.get(token.id);
	if (!token.passed) token.document.update({hidden: true});
	blindEffect = token.actor.effects.find(i => i.sourceName === "Prismatic Spray" && i.label == "Prismatic Spray Blindness");
	blindEffect.delete();  
}


//remove variables
DAE.setFlag(caster, "PrismaticSprayBlind", []);
let effect = caster.effects.find(i => i.sourceName === "Prismatic Spray" && i.label == "Prismatic Spray Blindness");
effect.delete();