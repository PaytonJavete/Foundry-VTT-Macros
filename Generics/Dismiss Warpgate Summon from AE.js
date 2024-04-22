//##############################################################################################################################
// Call Macro
// - On self applied effect
// Variables (search and replace)
// - NAME : name of the token that is summoned
//##############################################################################################################################
if (args[0] === "off"){
	const userId = game.userId;
	let token_S = canvas.tokens.placeables.find(t => t.actor.flags?.warpgate?.control.user == userId && t.document.name.includes("NAME"));
	if (token_S)token_S.document.delete();
}