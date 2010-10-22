var torque = 20;
var chargeRadius = 8.0;

private var playerMarble : GameObject;
private var attack = false;
private var home : Vector3;

private var speed : Vector3 = Vector3 (3, 0, 0);


function Awake() {
	playerMarble = GameObject.Find("Marble");
	home = transform.position;
}

function Attack() {
	attack = true;
}

function CalmDown() {
	attack = false;	
}

function Update() {
	var distance =  Vector3.Distance(playerMarble.transform.position, transform.position);
	var direction = Vector3.Normalize(playerMarble.transform.position - transform.position);
	
	//Debug.Log(direction);

	Debug.DrawLine(transform.position, playerMarble.transform.position, Color.red);

	if (attack) {
		rigidbody.AddTorque(direction * 10);
	} else {
		
	}
	
}