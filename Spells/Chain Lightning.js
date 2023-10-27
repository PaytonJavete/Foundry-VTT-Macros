// OnUse - After targeting

let workflow = MidiQOL.Workflow.getWorkflow(args[0].uuid);
let targetList = game.user.targets;
let caster = workflow.token;

// use first token targeted as initial target, remove from list
const [initTarget] = targetList;

let sequence = new Sequence() // this is the naimation part, handled by the Sequencer module
    .effect()
        .file("jb2a.chain_lightning.primary.blue")
        .atLocation(caster) // Going from origin
        .stretchTo(initTarget) // To the current loop's target                                            
        .waitUntilFinished(-1100)// The next sequence will start 1.1 seconds before the end of the primary Lightning

    .effect()
        .file("jb2a.static_electricity.02.blue")
        .atLocation(initTarget)
        .wait(100)

let skipFirst = true;
for(let target of targetList){
    if(skipFirst){
        skipFirst = false;
        continue;
    }
    sequence
        .effect()
            .file("jb2a.chain_lightning.secondary.blue")
            .atLocation(initTarget) // Going from origin
            .stretchTo(target) // To the current loop's target                                                     
            .wait(100)// Slight delay between each arc
}

sequence.play()