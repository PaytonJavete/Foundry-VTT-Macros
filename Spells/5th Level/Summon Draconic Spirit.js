const lastArg = args[args.length-1];
let tactor = canvas.tokens.get(lastArg.tokenId).actor;
let effect =  tactor.effects.find(e => e.name === "Summon Draconic Spirit");
let changes = foundry.utils.duplicate(effect.changes);
let type = null;
let confirmed = false;

let dialog = new Promise((resolve, reject) => {
    new Dialog({
        title: 'Summon Draconic Spirit',
        content: `
        <p>WAIT until after summoning Draconic Spirit. Type chosen will determine your damage resistance and spirit breath weapon.</p>
          <form class="flexcol">
            <div class="form-group">
              <select id="type">
                <option value="acid">Acid</option>
                <option value="cold">Cold</option>
                <option value="fire">Fire</option>
                <option value="force">Force (Gem Only)</option>
                <option value="lightning">Lightning</option>
                <option value="necrotic">Necrotic (Gem Only)</option>
                <option value="poison">Posion</option>
                <option value="psychic">Psychic (Gem Only)</option>
                <option value="radiant">Radiant (Gem Only)</option>
                <option value="thunder">Thunder (Gem Only)</option>
              </select>
            </div>
          </form>
        `,
        buttons: {
            yes: {
                icon: '<i class="fas fa-bolt"></i>',
                label: 'Select',
                callback: async (html) => {
                    type = html.find('#type').val();
                    resolve(true);
                },
            },
        }
    }).render(true);
})
confirmed = await dialog;
if (!confirmed) return;

changes[0].value = type;
await effect.update({changes});