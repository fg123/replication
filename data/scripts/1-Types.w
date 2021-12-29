
struct Vector2 => (x, y) {
    Size => () {
        ret (this.x ^ 2 + this.y ^ 2) ^ 0.5;
    }
    Normalize => () {
        let size = this.Size();
        ret Vector2(this.x / size, this.y / size);
    }
};

struct Vector3 => (x, y, z) {
    init => () {
        if (arguments.size == 1) {
            this.x = arguments[0];
            this.y = arguments[0];
            this.z = arguments[0];
        }
        else if (arguments.size == 3) {
            this.x = arguments[0];
            this.y = arguments[1];
            this.z = arguments[2];
        }
        else {
            "Invalid Arity Passed To Vector3 Constructor!";
        }
        ret this;
    }
    Size => () {
        ret (this.x ^ 2 + this.y ^ 2 + this.z ^ 2) ^ 0.5;
    }
    Normalize => () {
        let size = this.Size();
        ret Vector3(this.x / size, this.y / size, this.z / size);
    }
};

let PI = 3.1415926535;

let glm_Rotate => (vec, theta) native glm_Rotate;

struct Quaternion => (x, y, z, w) {
    Size => () {
        ret (this.x ^ 2 + this.y ^ 2 + this.z ^ 2 + this.w ^ 2) ^ 0.5;
    }
    Normalize => () {
        let size = this.Size();
        ret Quaternion(this.x / size, this.y / size, this.z / size, this.w / size);
    }

    FromRotation => (rot, vec) {
        ret glm_Rotate(vec, rot % (2 * PI));
    }
};

struct Vector => {
    Up = Vector3(0, 1, 0)
};

let @ <Vector2> => (p) "{" + p.x + ", " + p.y + "}"
let @ <Vector3> => (p) "{" + p.x + ", " + p.y + ", " + p.z + "}"
let @ <Quaternion> => (p) "{" + p.x + ", " + p.y + ", " + p.z + ", " + p.w + "}";

let Vector3FromList => (lst) Vector3(...lst);
let Vector2FromList => (lst) Vector3(...lst);
let QuaternionFromList => (lst) Quaternion(...lst);

let <Vector3> + <Vector3> => (a, b) Vector3(a.x + b.x, a.y + b.y, a.z + b.z);
let <Vector3> - <Vector3> => (a, b) Vector3(a.x - b.x, a.y - b.y, a.z - b.z);
let - <Vector3> => (v) Vector3(-v.x, -v.y, -v.z);
let <Vector3> * <number> => (v, s) Vector3(s * v.x, s * v.y, s * v.z);
let <number> * <Vector3> => (s, v) v * s

let - <Vector2> => (v) Vector2(-v.x, -v.y);


// Utils
struct Random => [float_between, float, int];

Random.float => () native random_float;
Random.float_between => (min, max) this.float() * (max - min) + min;
Random.int => (min, max) (this.float() * (max - min) + min) \ 1;
