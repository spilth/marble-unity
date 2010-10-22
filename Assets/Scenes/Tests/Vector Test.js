var objectA : GameObject;
var objectB : GameObject;

private var distance;
private var output;

function Update () {
	Debug.DrawLine(objectA.transform.position, objectB.transform.position);
	
	distance = Vector3.Distance(objectA.transform.position, objectB.transform.position);	
}

function OnGUI() {
	output = "Distance: " + distance
	+ "\nObject A: " + objectA.transform.position
	+ "\nObject B: " + objectB.transform.position
	;	
	
	GUI.TextArea(Rect (10,10,400,400), output);
}