if (args[0] == "on"){
    const lastArg = args[args.length-1];
    const actor = canvas.tokens.get(lastArg.tokenId).actor;
    const effect = actor.effects.find(effect => effect.label == "Divine Word");
    const HP = actor.system.attributes.hp.value;
    if (HP <= 20){
        actor.update({"system.attributes.hp.value": 0});
        effect.delete();
    }
    else if (HP <= 30){
        effect.update({duration: {seconds: 3600}});
        effect.update({changes: [{
            "key": "macro.CE",
            "value": "Deafened",
            "mode": 0,
            "priority": 20
        },
        {
            "key": "macro.CE",
            "value": "Blinded",
            "mode": 0,
            "priority": 20
        },
        {
            "key": "macro.CE",
            "value": "Stunned",
            "mode": 0,
            "priority": 20
        }
        ]});
    }
    else if (HP <= 40){
        effect.update({duration: {seconds: 600}});
        effect.update({changes: [{
            "key": "macro.CE",
            "value": "Deafened",
            "mode": 0,
            "priority": 20
        },
        {
            "key": "macro.CE",
            "value": "Blinded",
            "mode": 0,
            "priority": 20
        },
        ]});
    }
    else if (HP <= 50){
        effect.update({duration: {seconds: 60}});
        effect.update({changes: [{
            "key": "macro.CE",
            "value": "Deafened",
            "mode": 0,
            "priority": 20
        }]});
    }
    else {
        effect.delete();
    }
}