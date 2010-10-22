private var sun : Transform;

function Start () {
    sun = GameObject.Find("Main Light").transform;
}

function Update () {
  transform.rotation = sun.rotation;
}
