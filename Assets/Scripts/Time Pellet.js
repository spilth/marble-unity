var seconds = 2.0;
var eaten = false;

private var marble;
private var marbleScript;

function Awake() {
	marble = GameObject.Find("Marble");
	marbleScript = marble.GetComponent("Marble");
}

function OnTriggerEnter (other : Collider) {
	if (other.gameObject == marble) {
	    if (!eaten) {
			eaten = true;
	    	audio.Play();
			renderer.enabled = false;
	    	marbleScript.AddTime(seconds);
    	}
	}
}
