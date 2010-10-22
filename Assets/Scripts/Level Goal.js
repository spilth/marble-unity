private var marble;
private var marbleScript;

function Awake() {
	marble = GameObject.Find("Marble");
	marbleScript = marble.GetComponent("Marble");
}

function OnTriggerEnter (other : Collider) {
	if (other.gameObject == marble) {
		marbleScript.Finish();
	}
}
