let workflow = MidiQOL.Workflow.getWorkflow(args[0].uuid); // this gets a copy of the "live" workflow\

const portentRoll = workflow.actor.flags.dae.NextPortent;
const diceRoll = workflow.attackRoll.dice[0].results[0].result;
const bonus = workflow.attackRoll.total - diceRoll;
let roll = `1d20min${portentRoll}max${portentRoll} + ${bonus}`;
workflow.attackRoll = await new Roll(`${roll}`).roll();
workflow.attackTotal = workflow.attackRoll.total;
if (portentRoll == 20){
	workflow.isCritical = true;
	workflow.critFlagSet = true;
	workflow.rollOptions.critical = true;
}
workflow.attackRollHTML = await workflow.attackRoll.render();	