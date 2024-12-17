//##############################################################################################################################
// Call Macro
// - On self applied effect
// - macro.execute
//    - value: "Dimiss Summon" "NAME"
// Variables
// - name : common name (e.g. Elemental Spirit for Elemental Spirit - Air/Water/Earth/Fire) of the token that is summoned, passed from effect
//##############################################################################################################################
const lastArg = args[args.length - 1];
const name = args[1];
if (args[0] === "on"){
	let tokenHook = Hooks.on("createToken", (token) => {
		if(!token.name.includes(name)) return;
		token.update({"flags.aeDismiss.actorId": lastArg.actorUuid})
		Hooks.off("createToken", tokenHook); 
	});
}
if (args[0] === "off"){
	let token_S = canvas.tokens.placeables.find(t => t.document.flags?.aeDismiss?.actorId == lastArg.actorUuid && t.document.name.includes(name));
	if (token_S) token_S.document.delete();
}