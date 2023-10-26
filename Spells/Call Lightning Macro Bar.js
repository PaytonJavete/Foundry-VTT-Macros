let concentrating = actor.effects.some(effect => effect.sourceName == "Call Lightning" && effect.label == "Concentrating");
if(!concentrating){
    let dialog = new Promise((resolve, reject) => {
      new Dialog({
          title: 'Is it storming?',
          content: ``,
          buttons: {
              yes: {
                  icon: '<i class="fas fa-bolt"></i>',
                  label: 'Yes',
                  callback: async (html) => {
                      await DAE.setFlag(actor, "CallLightning", true);
                      ChatMessage.create({
                            user: game.user._id,
                            speaker: ChatMessage.getSpeaker({token: actor}),
                            content: `${actor.name} takes control of the storm above...`
                        });
                        const item = actor.items.getName("Call Lightning");
                        const workflowItemData = duplicate(item);
                        workflowItemData.system.target = {value: null, width: null, units: null, type: 'self'};
                        workflowItemData.system.range = {value: null, long: null, units: 'self'};

                        const spellItem = new CONFIG.Item.documentClass(workflowItemData, { parent: actor });
                        const options = { showFullCard: false, createWorkflow: true, configureDialog: true };
                        const result = await MidiQOL.completeItemRoll(spellItem, options);
                  },
              },
              no: {
                  icon: '<i class="fa-solid fa-x"></i>',
                  label: 'No',
                  callback: async (html) => {
                      await DAE.setFlag(actor, "CallLightning", false);
                      dnd5e.documents.macro.rollItem("Call Lightning")
                  },
              },
          }
      }).render(true);
    })
    await dialog;
    
} else {
    const item = actor.items.getName("Call Lightning");
    const damageDie = await DAE.getFlag(actor, "CallLightning");
    const workflowItemData = duplicate(item);
    workflowItemData.name = "Call Lightning Bolt";
    workflowItemData.label = "Call Lightning Bolt";
    workflowItemData.system.components.concentration = false;
    workflowItemData.system.preparation.mode = "atwill";
    workflowItemData.system.uses = {max: null, per: "", value: null};
    workflowItemData.system.duration = { value: null, units: "inst" };
    workflowItemData.system.actionType = "save";
    workflowItemData.system.save = {ability: 'dex', dc: actor.system.attributes.spelldc, scaling: 'spell'};
    workflowItemData.system.target = {value: 5, width: null, units: 'ft', type: 'cylinder'};
    workflowItemData.system.damage.parts[0] = [`${damageDie}d10[lightning]`, 'lightning'];

    const spellItem = new CONFIG.Item.documentClass(workflowItemData, { parent: actor });
    const options = { showFullCard: false, createWorkflow: true, configureDialog: true };
    const result = await MidiQOL.completeItemRoll(spellItem, {}, options);  
}