lastArg = args[args.length-1];
const actor = canvas.tokens.get(lastArg.tokenId).actor;

if (args[0] === "on"){
    const buttonData = {
        buttons: [{
            label: "Tiny", 
            value: { 
                token: {
                    name: "Animated Object - Tiny",
                },
                actor: {
                    name: "Animated Object - Tiny", 
                },
                n: 1
            }
        },{
            label: "Small", 
            value: { 
                token: {
                    name: "Animated Object - Small",
                },
                actor: {
                    name: "Animated Object - Small", 
                },
                n: 1
            }
        },{
            label: "Medium (2)", 
            value: { 
                token: {
                    name: "Animated Object - Medium",
                },
                actor: {
                    name: "Animated Object - Medium", 
                },
                n: 2
            }
        },{
            label: "Large (4)", 
            value: { 
                token: {
                    name: "Animated Object - Large",
                },
                actor: {
                    name: "Animated Object - Large", 
                },
                n: 4
            }
        },{
            label: "Huge (8)", 
            value: { 
                token: {
                    name: "Animated Object - Huge",
                },
                actor: {
                    name: "Animated Object - Huge", 
                },
                n: 8
            }
        }]
    }

    let n = 10;
    let summons = [];
    while (n > 0){
        buttonData.title = `You have ${n} object point(s) remaining.`;
        const choice = await warpgate.buttonDialog(buttonData);
        if (choice === false) return;
        const cost = choice.n;
        if (cost > n){
            ui.notifications.warn(`${choice.actor.name} costs ${cost}, you only have ${n} points remaining.`)
        } else {
            let [summonId] = await warpgate.spawn(choice.actor.name, choice);
            summons.push(summonId);
            n -= cost;
        }
    }

    DAE.setFlag(actor, "AnimateObjects", summons);
} else if (args[0] === "off"){
    const summons = DAE.getFlag(actor, "AnimateObjects");
    for (s of summons) warpgate.dismiss(s);
}