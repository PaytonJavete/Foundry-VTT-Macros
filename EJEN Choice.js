let optionsText = "";
optionsText += `<option value="LFD">Let Fate Decide</option>`;
optionsText += `<option value="Erwin Carrington">Erwin</option>`;
optionsText += `<option value="Johansson (Hans) Schmetterling">Johansson</option>`;
optionsText += `<option value="Ellis Blacksmith">Ellis</option>`;
optionsText += `<option value="Nathaniel (Nathan) Longfellow">Nathaniel</option>`;

let name = "";

let confirmed = false;
let dialog = new Promise((resolve, reject) => { 
    new Dialog({
    title: "Who are you?",
    content: `
    <form id="ejen-use-form">
        <div class="form-group">
            <label>Personality</label>
            <div class="form-fields">
                <select name="person">` + optionsText + `</select>
            </div>
        </div>
    </form>
    `,
    buttons: {
        one: {
            icon: '<i class="fas fa-check"></i>',
            label: "Who am I?",
            callback: () => resolve(true)
        },
        two: {
            icon: '<i class="fas fa-times"></i>',
            label: "Cancel",
            callback: () => {resolve(false)}
        }
    },
    default: "Cancel",
    close: html => {
        name = html.find('[name=person]')[0].value;
    }
  }).render(true);
});
confirmed = await dialog;
if(!confirmed) return;

if (name == "LFD"){
	roll = await new Roll('1d4').evaluate({async: true});
	await game.dice3d.showForRoll(roll);
	switch(roll.total){
		case 1:
			name = "Erwin Carrington";
			break;
		case 2:
			name = "Johansson (Hans) Schmetterling";
			break;
		case 3:
			name = "Ellis Blacksmith"
			break;
		case 4:
			name = "Nathaniel (Nathan) Longfellow"
			break;
	}
}

let token = canvas.tokens.controlled[0];
let actor = token.actor;
let nickname = name.split(' ')[0];
if (nickname == "Johansson") nickname = "Hans";
else if (nickname == "Nathaniel") nickname = "Nathan";

await actor.update({name: name});
await token.document.update({name: nickname});
await actor.prototypeToken.update({name: nickname});