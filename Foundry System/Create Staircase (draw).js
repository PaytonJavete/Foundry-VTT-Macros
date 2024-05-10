class Point 
{
    constructor(a,b)
    {
        this.x=a;
        this.y=b;
    }
}

const radians = Math.toRadians(drawParams.template.direction);
const incX = Math.round(100*Math.cos(radians));
const incY = Math.round(100*Math.sin(radians));

//Shape
let a = new Point(), b = new Point(), c = new Point(), d = new Point();
let p = new Point(drawParams.template.x, drawParams.template.y);
let q = new Point(drawParams.template.x+incX, drawParams.template.y+incY)
let l = drawParams.width*20;
// horizontal rectangle
if (p.x == q.x) 
{
    a.x =  (p.x - (l / 2.0));
    a.y = p.y;

    d.x =  (p.x + (l / 2.0));
    d.y = p.y;

    b.x =  (q.x - (l / 2.0));
    b.y = q.y;

    c.x =  (q.x + (l / 2.0));
    c.y = q.y;
} 
// vertical rectangle 
else if (p.y == q.y)
{
    a.y = (p.y - (l / 2.0));
    a.x = p.x;

    d.y = (p.y + (l / 2.0));
    d.x = p.x;

    b.y = (q.y - (l / 2.0));
    b.x = q.x;

    c.y = (q.y + (l / 2.0));
    c.x = q.x;
} 
// slanted rectangle 
else
{
    // calculate slope of the side 
    let m = (p.x - q.x) / (q.y - p.y);

    // calculate displacements along axes 
    let dx =  ((l / Math.sqrt(1 + (m * m))) * 0.5);
    let dy = m * dx;

    a.x = p.x - dx;
    a.y = p.y - dy;

    d.x = p.x + dx;
    d.y = p.y + dy;

    b.x = q.x - dx;
    b.y = q.y - dy;

    c.x = q.x + dx;
    c.y = q.y + dy;
}

const startX = Math.min(a.x, b.x, c.x, d.x);
const startY = Math.min(a.y, b.y, c.y, d.y);

const rectangleW = Math.max(a.x, b.x, c.x, d.x) - Math.min(a.x, b.x, c.x, d.x);
const rectangleH = Math.max(a.y, b.y, c.y, d.y) - Math.min(a.y, b.y, c.y, d.y);

const shapeD = {
    type: "p",
    width: rectangleW,
    height: rectangleH,
    radius: null,
    points: [
        a.x - startX,
        a.y - startY,
        b.x - startX,
        b.y - startY,
        c.x - startX,
        c.y - startY,
        d.x - startX,
        d.y - startY,
        a.x - startX,
        a.y - startY
    ]
};

function addDrawing(x, y, mode, b, t) {
	drawing = {
	      shape: shapeD,
	      x: x,
	      y: y,
	      hidden: true,
	      flags: {
	        levels: {
			    rangeBottom: b,
			    rangeTop: t,
			    drawingMode: mode,
			    elevatorFloors: ""
			}
	      }
	  }

	console.log(drawing);
	drawings = [];
	doc = new CONFIG.Drawing.documentClass(drawing, { parent: canvas.scene });
	drawings.push(doc);
	canvas.scene.createEmbeddedDocuments("Drawing", drawings);
}

console.log(drawParams);

//Does not work with rotation!! Levels doesn't use rotation when checking drawing area. Changing from rectangle to polygon
const modeDown = 21; //down only
const modeUp = 22; //up only

//Finds optimal stair heights
const numStairs = Math.round(drawParams.length/5);
const iterate = Math.floor(drawParams.height/numStairs);
let remainder = drawParams.height%numStairs;
const rPart1 = numStairs-remainder;
const ratio = rPart1 > remainder ? Math.round(rPart1/remainder) : Math.round(numStairs/rPart1);
const grStair = rPart1 > remainder ? true : false;
let incHeight = [];
for (let i = 1; i <= numStairs; i++){
	number = iterate;
	if (remainder > 0){
		if(i%ratio == 0 && grStair){
			number += 1;
			remainder -= 1;
		} else if(i%ratio != 0 && !grStair){
			number += 1;
			remainder -= 1;
		}
	}
	if ((remainder == 1) && (i == numStairs)){
		ui.notifications.warn("Unexpected staircase corrected");
		number += 1;
	} else if ((remainder > 1) && (i == numStairs)) return ui.notifications.error(`${remainder}ft. missing from staircase!`);
	incHeight.push(number);
}
console.log(incHeight);

//Stairs going up
let bot = drawParams.bottom ? drawParams.bottom : 0;
let top = drawParams.bottom ? drawParams.bottom : 0;
top = top + incHeight[0] - 1;
let j = -1;
for (let i = 0; i < numStairs; i++){
	thisX = startX+(incX*j);
	thisY = startY+(incY*j);
	addDrawing(thisX, thisY, modeDown, bot, top);
	if (i == (numStairs-1)) break;
	top = top + incHeight[i+1];
	bot = bot + incHeight[i];
	j += 1;
}

//Stairs going down
bot = drawParams.bottom ? drawParams.bottom : 0;
top = drawParams.bottom ? drawParams.bottom : 0;
top = top + incHeight[0] - 1;
j = 0;
for (let i = 0; i < numStairs; i++){
	thisX = startX+(incX*j);
	thisY = startY+(incY*j);
	addDrawing(thisX, thisY, modeUp, bot, top);
	if (i == (numStairs-1)) break;
	top = top + incHeight[i+1];
	bot = bot + incHeight[i];
	j += 1;
}