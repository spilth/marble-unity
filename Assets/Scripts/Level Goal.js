private var marble;
private var marbleScript;
private var distance;
private var triggered = false;

function Awake() {
	marble = GameObject.Find("Marble");
	marbleScript = marble.GetComponent("Marble");
}

function OnTriggerStay (other : Collider) {
  distance = Vector3.Distance(other.transform.position, transform.position);
  
  if (!triggered && distance < 0.75) {
	if (other.gameObject == marble) {
		triggered = true;
		marbleScript.Finish();
	}
  }   
}
