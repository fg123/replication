
struct Vector2 => (x, y);
struct Vector3 => (x, y, z);
let @ <Vector2> => (p) "{" + p.x + ", " + p.y + "}"
let @ <Vector3> => (p) "{" + p.x + ", " + p.y + ", " + p.z + "}"

let Vector3FromList => (lst) Vector3(lst[0], lst[1], lst[2]);
let Vector2FromList => (lst) Vector3(lst[0], lst[1]);