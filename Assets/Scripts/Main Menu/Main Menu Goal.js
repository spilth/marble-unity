var targetLevel = 1;

private var distance;

function OnTriggerStay (other : Collider) {
  distance = Vector3.Distance(other.transform.position, transform.position);
  
  if (distance < 0.5) {
    Application.LoadLevel(targetLevel);
  }   
}

