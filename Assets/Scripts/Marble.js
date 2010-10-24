//#pragma strict

var levelName = "NO NAME";	// Name of level displayed at level start.
var levelTime = 10.0;
var levelMusic : AudioClip;

var breakingSound : AudioClip;
var collisionSound : AudioClip;
var dizzySound : AudioClip;
var deathSound : AudioClip;
var fallingSound : AudioClip;
var finishSound : AudioClip;

var timerTexture : Texture;
var timerBackground : Texture;

var customSkin : GUISkin;
var dizziness : GameObject;
var explosion : GameObject;

enum GameState {Waiting, Playing, Finished, Dead}
enum DeathTrigger {OutOfTime, Falling, Broke}

private var gameState = GameState.Waiting;
private var deathTrigger = DeathTrigger.OutOfTime;

private var torque = 25.0;
private var angularVelocityCap = 8.0;

private var timeRemaining = 0.0;

private var horizontalAxis = 0.0;
private var verticalAxis = 0.0;

private var isDizzy = false;
private var dizzyThreshold = 1.9;
private var dizzyDuration = 2.0;

private var breakingThreshold = 2.9;

function Awake() {
	rigidbody.maxAngularVelocity = angularVelocityCap;
	audio.clip = levelMusic;
}

function Start() {
	if (IsMainMenu()) {
		StartPlaying();	
	}
	
	if (IsFirstLevel()) {
		ResetCollectedTime();
	}

	timeRemaining = levelTime + GetCollectedTime();
}

private var oldContactHeight = 0.0;
private var newContactHeight = 0.0;
private var contactDistance = 0.0;

function OnCollisionEnter(collision : Collision) {
	newContactHeight = collision.contacts[0].point.y;
	contactDistance = oldContactHeight - newContactHeight;
	
	//Debug.Log("Old: " + oldContactHeight + ", New: " + newContactHeight + ", Distance: " + contactDistance);
	
	if (contactDistance > 2.9) {
		deathTrigger = DeathTrigger.Broke;
		Die();
		return;
	}
	
	if (contactDistance > 1.9 && !isDizzy) {
		BecomeDizzy();
		return;
	}

	oldContactHeight = newContactHeight;

}

function FixedUpdate() {
	if (gameState == GameState.Playing) {
		rigidbody.AddTorque(Vector3.forward * torque * verticalAxis);
		rigidbody.AddTorque(Vector3.right * torque * horizontalAxis);
	}
}

function Update () {
	switch(gameState) {
		case GameState.Playing:
			if (timeRemaining < 0.0) {
				DieFromZeroTime();
				return;	
			}
		
			if (!IsMainMenu()) {
				timeRemaining -= 1.0 * Time.deltaTime;
			}
						
			if (!isDizzy) {
				horizontalAxis = Input.GetAxis("Horizontal");
		    	verticalAxis = Input.GetAxis("Vertical");
			}
			
			if (Application.isEditor) {
				if (Input.GetKeyUp(KeyCode.T)) {
					AddTime(5.0);
				}			
			}

			break;
		
		case GameState.Waiting:
			if (Input.GetKeyUp(KeyCode.Space) || Input.GetButtonDown("Fire1")) {
				StartPlaying();
			}
			break;
			
		case GameState.Finished:
			if (Input.GetKeyUp(KeyCode.Space) || Input.GetButtonDown("Fire1")) {
				LoadNextLevel();
			}
			break;
			
		case GameState.Dead:
			if (Input.GetKeyUp(KeyCode.Space) || Input.GetButtonDown("Fire1")) {
				Respawn();
			}
			break;
	}
}

function StartPlaying() {
	gameState = GameState.Playing;
	audio.Play();
}

function Respawn() {
	Application.LoadLevel(Application.loadedLevel);
}

function LoadNextLevel() {
	var levelCount = Application.levelCount;
	var currentLevel = Application.loadedLevel;
	var nextLevel = currentLevel + 1;
	Application.LoadLevel(nextLevel);
}

function AddTime(seconds : float) {
  timeRemaining += seconds;	
}

function DieFromZeroTime() {
	deathTrigger = DeathTrigger.OutOfTime;
	Die();
}

function DieFromFalling() {
	deathTrigger = DeathTrigger.Falling;
	Die();	
}

function DieFromBreaking() {
	deathTrigger = DeathTrigger.Broke;
	Die();
}

function BecomeDizzy() {
	isDizzy = true;
	audio.PlayOneShot(dizzySound);
	var instantiatedDizziness : Object = Instantiate(dizziness, transform.position, transform.rotation);
	yield WaitForSeconds(dizzyDuration);
	isDizzy = false;
}

function Die() {
	gameState = GameState.Dead;
	rigidbody.Sleep();

	switch (deathTrigger) {
		case DeathTrigger.OutOfTime:
			audio.PlayOneShot(deathSound);
			break;
			
		case DeathTrigger.Falling:
			audio.PlayOneShot(fallingSound);	
			break;
			
		case DeathTrigger.Broke:
			renderer.enabled = false;
			
			// TODO: Figure out how to make this work with pragma strict
			var instantiatedExplosion : Object = Instantiate(explosion, transform.position, transform.rotation);
			//Object.Destroy(instantiatedExplosion, 3);
			//audio.PlayOneShot(breakingSound);
			break;				
	}
}

function Finish() {
	gameState = GameState.Finished;
	rigidbody.Sleep();
	audio.PlayOneShot(finishSound);
	SetCollectedTime(timeRemaining);
}

function IsMainMenu() {
	return (Application.loadedLevel == 0);
}

function IsFirstLevel() {
	return (Application.loadedLevel == 1);
}

function ResetCollectedTime() {
	PlayerPrefs.SetFloat("CollectedTime", 0.0);
}

function SetCollectedTime(time : float) {
	PlayerPrefs.SetFloat("CollectedTime", time);
}

function GetCollectedTime() {
	return PlayerPrefs.GetFloat("CollectedTime");
}

function OnGUI() {
	//DrawDebugGUI();
	
	GUI.skin = customSkin;
			
	switch (gameState) {
		case GameState.Playing:
			DrawPlayingGUI();
			break;

		case GameState.Dead:
			DrawDeadGUI();
			break;

		case GameState.Finished:
			DrawFinishedGUI();
			break;

		case GameState.Waiting:
			DrawWaitingGUI();
			break;

	}
}

function DrawDebugGUI() {
	var output = "Velocity: " + rigidbody.velocity
	+ "\nAngular Velocity: " + rigidbody.angularVelocity
	+ "\nPosition: " + rigidbody.position
	;	
	
	GUI.TextArea(Rect (10,10,200,200), output);
}

function DrawPlayingGUI() {
	if (!IsMainMenu()){
		//GUI.Label (Rect (0 ,20,Screen.width,50), "" + parseInt(Mathf.Ceil(timeRemaining)));

		GUI.DrawTexture(Rect((Screen.width / 2) - 300, 8, 600, 16), timerBackground);		
		GUI.DrawTexture(Rect((Screen.width / 2) - 300, 8, 10 * timeRemaining, 16), timerTexture);
	}
}

function DrawWaitingGUI() {
	if (!IsMainMenu()) {
		GUI.Label (Rect (0,10,Screen.width,50), levelName);
		GUI.Label (Rect (0,50,Screen.width,50), "Level  " + levelTime + "  seconds");
		if (!IsFirstLevel()) {
			GUI.Label (Rect (0,90,Screen.width,50), "Collected  " + parseInt(GetCollectedTime()) + "  seconds");
		}
		GUI.Label (Rect (0,130,Screen.width,50), "Total  " + parseInt(timeRemaining) + "  seconds");
		GUI.Label (Rect (0,170,Screen.width,50), "Press  Space  to  Start");	
	}
}

function DrawDeadGUI() {
	switch (deathTrigger) {
		case DeathTrigger.Broke:
			GUI.Label (Rect (0, 10,Screen.width,50), "You  Broke!");
			break;
		case DeathTrigger.OutOfTime:
			GUI.Label (Rect (0, 10,Screen.width,50), "Out  Of  Time!");
			break;
		case DeathTrigger.Falling:
			GUI.Label (Rect (0, 10,Screen.width,50), "You  Fell  Into  The  Void!");
			break;
	}
	
	GUI.Label (Rect (0, 50,Screen.width,50), "Press  Space  to  Try  Again");	
}

function DrawFinishedGUI() {
	GUI.Label (Rect (0, 10,Screen.width,50), "Level Finished!");	
	GUI.Label (Rect (0, 50,Screen.width,50), parseInt(timeRemaining) + "  seconds  left");
	GUI.Label (Rect (0, 90,Screen.width,50), "Press  Space  for  Next  Level!");	
}
