var targetLevel = 1;

function OnTriggerEnter (other : Collider) {
	Application.LoadLevel(targetLevel);
}
