var res = {
	// images
    backgroundImage: "res/Images/Background.png",
    glowImage: "res/Images/Glow.png",
    blockImage: "res/Images/Projectile.png",

    // sound
    backgroundTrack: "res/Sounds/Track1.mp3",
    successTrack: "res/Sounds/Ka-Ching.wav",
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}