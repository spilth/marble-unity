var patroller : GameObject;

private var patrollerScript;
private var marble;

function Awake() {
	marble = GameObject.Find("Marble");
	patrollerScript = patroller.GetComponent("Enemy Marble");
}


function OnTriggerEnter (other : Collider) {
	if (other.gameObject == marble) {
		Debug.Log("Attack!!!");
		patrollerScript.Attack();
	}
}

function OnTriggerExit (other : Collider) {
	if (other.gameObject == marble) {
		Debug.Log("Calm Down!");
		patrollerScript.CalmDown();
	}
}

