//##############################################################################################################################
// Call Macro
// - On self applied effect
// Variables (search and replace)
// - NAME : name of the token that is summoned
//##############################################################################################################################
if (args[0] === "off"){
	const userId = game.userId;
	let token_S = canvas.tokens.placeables.filter(t => t.actor.flags?.warpgate?.control.user == userId && t.document.name == "NAME")[0];
	if (token_S)token_S.document.delete();
}