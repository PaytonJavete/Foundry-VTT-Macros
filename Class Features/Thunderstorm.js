let hasEffectApplied = await game.dfreds.effectInterface.hasEffectApplied('Raging Storm - Lightning', uuid);
if(hasEffectApplied){   
   let workflow = MidiQOL.Workflow.getWorkflow(args[0].uuid);
   console.log(workflow);
   workflow.damageDetail[0].type = "lightning";
   workflow.defaultDamageType = "lightning";
   workflow.item.labels.damageTypes = "Lightning";
}