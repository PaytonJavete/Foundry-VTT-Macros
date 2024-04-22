token = canvas.tokens.controlled[0];
lightdata = {
    "alpha": 0.5,
    "angle": 360,
    "bright": 15,
    "color": "#1d3021",
    "coloration": 1,
    "dim": 30,
    "attenuation": 0.5,
    "luminosity": 0.5,
    "saturation": 0,
    "contrast": 0,
    "shadows": 0,
    "animation": {
        "type": "flame",
        "speed": 4,
        "intensity": 1,
        "reverse": false
    },
    "darkness": {
        "min": 0,
        "max": 1
    }
}
if (token.document.light.dim == 30){
	lightdata.bright = 0;
	lightdata.dim = 15;
}

token.document.update({light: lightdata})