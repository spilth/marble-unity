var isQuit = false;

function OnMouseEnter() {
	renderer.material.color = Color.green;
	audio.Play();
}

function OnMouseExit() {
	renderer.material.color = Color.white;
}

function OnMouseUp() {
	if (!isQuit) {
		Application.LoadLevel("Level 1");
	} else {
		Application.Quit();
	}
}