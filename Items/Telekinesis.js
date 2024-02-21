const lastArg = args[args.length - 1];
console.log(args);

if (args[0].tag === "OnUse") {
	const caster = await fromUuid(lastArg.tokenUuid);

	for (target of lastArg.targets){
		new Sequence()
		  .effect()
		    .file("jb2a.boulder.toss.02.01.stone.brown")
		    .atLocation(caster)
		    .stretchTo(target)
		    .waitUntilFinished(-100)
		  .effect()
		    .file("jb2a.impact.boulder.02")
		    .atLocation(target)
		  .play();
	}
} 
// else if (args[0] == "on") {
// 	const target = await fromUuid(lastArg.actorUuid);
// 	const caster = await fromUuid(lastArg.origin);
// 	let spellAtr = caster.system.attributes.spellcasting;
// 	const ability = "str";
//     const type = CONFIG.DND5E.abilities[ability];
//     const flavor = `${condition} (via ${name}) : ${type} check vs DC${saveDc}`;
//     const roll = await targetToken.actor.rollAbilityTest(ability, { flavor, async: true });
//     const rollTotal = await roll.total;
//     if (rollTotal >= saveDc) {
//       const effect = targetToken.actor.effects.find(e => e.label == name);
//       effect.delete();
//     } else {
//       ChatMessage.create({ content: `${targetToken.name} fails the ${type} check for ${name}, still has the ${condition} condition.` });
//     }
// }