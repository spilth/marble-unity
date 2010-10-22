var customSkin : GUISkin;

var playSound : AudioClip;

function OnGUI() {
	GUI.skin = customSkin;
	
	GUI.Label (Rect (Screen.width / 4, Screen.height / 2 - 160, Screen.width / 2, 140), "You Win!");
	
	GUI.SetNextControlName ("Play");
	if (GUI.Button (Rect (Screen.width / 4, Screen.height / 2, Screen.width / 2, 140), "Play Again")) {
		StartGame();
	}

	GUI.SetNextControlName ("Quit");	
	if (GUI.Button (Rect (Screen.width / 4, Screen.height / 2 + 160, Screen.width / 2, 50), "Quit")) {
		QuitGame();
	}
}

function StartGame() {
	audio.PlayOneShot(playSound);
	yield WaitForSeconds(1);
	Application.LoadLevel("Level 1");	
}

function QuitGame() {
	Application.Quit();	
}