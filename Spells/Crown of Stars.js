const lastArg = args[args.length-1];
const stars = 7 + (2 * (lastArg.spellLevel-7));
DAE.setFlag(lastArg.actor, "CrownofStars", stars);
const effect = lastArg.actor.effects.find(effect => effect.sourceName == "Crown of Stars");
effect.update({label: `Crown of Stars Effect - ${stars}`});