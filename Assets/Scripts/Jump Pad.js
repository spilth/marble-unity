var power = 1000;

function OnTriggerEnter (other : Collider) {
	other.rigidbody.AddForce(Vector3.up * power, ForceMode.VelocityChange);
	audio.Play();
}
