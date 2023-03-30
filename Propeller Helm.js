if (args[0] === "off"){
	const chanceRoll = await new Roll("1d100");
	await chanceRoll.toMessage({flavor: "If 50 or below, the propreller helm breaks :("});
}