let confirmed = false;
let length = 0;
let width = 0;
let height = 0;
let bottom = 0;
let drawMacro = "Create Staircase (draw)";

let dialog = new Promise((resolve, reject) => { 
		new Dialog({
		title: "Rectangular Staircase",
		content:`
		<h3>Please specify the stair length, width, and height in 5 feet increments.</h3>
			<label for="length">length(x)</label>
			<input type="number" id="length" name="length" min="5"></br>

			<label for="width">width(y)</label>
			<input type="number" id="width" name="width" min="5"></br>

			<label for="height">height(z)</label>
			<input type="number" id="height" name="height" min="5"></br>

			<label for="bottom">bottom of stairs elevation(default: 0)</label>
			<input type="number" id="bottom" name="bottom"></br>
		`,
		buttons: {
		    one: {
		        label: "Confirm",
		        callback: () => resolve(true)
		    },
		    two: {
		        label: "Cancel",
		        callback: () => {resolve(false)}
		    }
		},
		  default: "Cancel",
		  close: html => {
		    length = parseInt(html.find('[name=length]')[0].value);
	        width = parseInt(html.find('[name=width]')[0].value);
	        height = parseInt(html.find('[name=height]')[0].value);
	        bottom = parseInt(html.find('[name=bottom]')[0].value);			
	        resolve();
	    	}
    }).render(true);
  });  
confirmed = await dialog;

if (!confirmed) return;

Hooks.once("createMeasuredTemplate", async (template) => {
	console.log("hook called");
	const drawParams = {
        template: template,
        length: length,
		height: height,
		width: width,
		bottom: bottom,
    };
	canvas.scene.deleteEmbeddedDocuments("MeasuredTemplate", [template.id]);
	const gmMacro = game.macros.find(m => m.name === drawMacro);
    gmMacro.execute({drawParams});
});

const measureTemplateData = {
  t: "ray",
  user: game.userId,
  distance: length,
  width: width,
  direction: 0,
  x: 0,
  y: 0,
  fillColor: game.user.color,
};

const doc = new CONFIG.MeasuredTemplate.documentClass(measureTemplateData, { parent: canvas.scene });
const measureTemplate = new game.dnd5e.canvas.AbilityTemplate(doc);
//measureTemplate.actorSheet = targetActor.sheet;
measureTemplate.drawPreview();