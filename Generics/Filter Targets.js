//##############################################################################################################################
// Call Macro
// - Under item 'Details'
// - On Use Macros : After targeting complete
// Variables (search and replace)
// - FILTERS : statement that returns true or false
//##############################################################################################################################
lastArg = args[args.length-1];

if (args[0].macroPass === "preambleComplete"){
	let validTargets = lastArg.targets.filter(target => FILTERS);
	validIds = validTargets.map((t) => t.id);
	game.user.updateTokenTargets(validIds);
}