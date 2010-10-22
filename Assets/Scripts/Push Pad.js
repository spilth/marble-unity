var power = 1000;

function OnTriggerEnter (other : Collider) {	
	other.rigidbody.AddForce(transform.right * power, ForceMode.VelocityChange);
	audio.Play();
}
