//Port of glMatrix, taken from: https://github.com/toji/gl-matrix
module s2d {

    /* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE. */


    /**
     * @class 2 Dimensional Vector
     * @name Vector2
     */
    export class Vector2 extends Float32Array {

        /**
         * Creates a new, empty Vector2
         *
         * @returns {Vector2} a new 2D vector
         */
        public static create() : Vector2 {
            let a : any = new Float32Array(2);
            a[0] = 0;
            a[1] = 0;
            return a;
        }

        /**
         * Creates a new Vector2 initialized with values from an existing vector
         *
         * @param {Vector2} a vector to clone
         * @returns {Vector2} a new 2D vector
         */
        public static clone(a:Vector2) : Vector2 {
            let out = Vector2.create();
            out[0] = a[0];
            out[1] = a[1];
            return out;
        }

        /**
         * Creates a new Vector2 initialized with the given values
         *
         * @param {Number} x X component
         * @param {Number} y Y component
         * @returns {Vector2} a new 2D vector
         */
        public static fromValues(x: number, y: number) {
            let out = Vector2.create();
            out[0] = x;
            out[1] = y;
            return out;
        }

        /**
         * Copy the values from one Vector2 to another
         *
         * @param {Vector2} out the receiving vector
         * @param {Vector2} a the source vector
         * @returns {Vector2} out
         */
        public static copy(out: Vector2, a: Vector2): Vector2 {
            out[0] = a[0];
            out[1] = a[1];
            return out;
        }

        /**
         * Set the components of a Vector2 to the given values
         *
         * @param {Vector2} out the receiving vector
         * @param {Number} x X component
         * @param {Number} y Y component
         * @returns {Vector2} out
         */
        public static set(out: Vector2, x: number, y: number): Vector2 {
            out[0] = x;
            out[1] = y;
            return out;
        }

        /**
         * Adds two Vector2's
         *
         * @param {Vector2} out the receiving vector
         * @param {Vector2} a the first operand
         * @param {Vector2} b the second operand
         * @returns {Vector2} out
         */
        public static add(out: Vector2, a: Vector2, b: Vector2): Vector2 {
            out[0] = a[0] + b[0];
            out[1] = a[1] + b[1];
            return out;
        }

        /**
         * Subtracts vector b from vector a
         *
         * @param {Vector2} out the receiving vector
         * @param {Vector2} a the first operand
         * @param {Vector2} b the second operand
         * @returns {Vector2} out
         */
        public static sub(out: Vector2, a: Vector2, b: Vector2): Vector2 {
            out[0] = a[0] - b[0];
            out[1] = a[1] - b[1];
            return out;
        }


        /**
         * Multiplies two Vector2's
         *
         * @param {Vector2} out the receiving vector
         * @param {Vector2} a the first operand
         * @param {Vector2} b the second operand
         * @returns {Vector2} out
         */
        public static mul(out: Vector2, a: Vector2, b: Vector2): Vector2 {
            out[0] = a[0] * b[0];
            out[1] = a[1] * b[1];
            return out;
        }

        /**
         * Divides two Vector2's
         *
         * @param {Vector2} out the receiving vector
         * @param {Vector2} a the first operand
         * @param {Vector2} b the second operand
         * @returns {Vector2} out
         */
        public static div(out: Vector2, a: Vector2, b: Vector2): Vector2 {
            out[0] = a[0] / b[0];
            out[1] = a[1] / b[1];
            return out;
        }

        /**
         * Math.ceil the components of a Vector2
         *
         * @param {Vector2} out the receiving vector
         * @param {Vector2} a vector to ceil
         * @returns {Vector2} out
         */
        public static ceil = function (out: Vector2, a: Vector2): Vector2 {
            out[0] = Math.ceil(a[0]);
            out[1] = Math.ceil(a[1]);
            return out;
        }

        /**
         * Math.floor the components of a Vector2
         *
         * @param {Vector2} out the receiving vector
         * @param {Vector2} a vector to floor
         * @returns {Vector2} out
         */
        public static floor(out: Vector2, a: Vector2): Vector2 {
            out[0] = Math.floor(a[0]);
            out[1] = Math.floor(a[1]);
            return out;
        }

        /**
         * Returns the minimum of two Vector2's
         *
         * @param {Vector2} out the receiving vector
         * @param {Vector2} a the first operand
         * @param {Vector2} b the second operand
         * @returns {Vector2} out
         */
        public static min(out: Vector2, a: Vector2, b: Vector2): Vector2 {
            out[0] = Math.min(a[0], b[0]);
            out[1] = Math.min(a[1], b[1]);
            return out;
        }

        /**
         * Returns the maximum of two Vector2's
         *
         * @param {Vector2} out the receiving vector
         * @param {Vector2} a the first operand
         * @param {Vector2} b the second operand
         * @returns {Vector2} out
         */
        public static max = function (out: Vector2, a: Vector2, b: Vector2): Vector2 {
            out[0] = Math.max(a[0], b[0]);
            out[1] = Math.max(a[1], b[1]);
            return out;
        }

        /**
         * Math.round the components of a Vector2
         *
         * @param {Vector2} out the receiving vector
         * @param {Vector2} a vector to round
         * @returns {Vector2} out
         */
        public static round(out: Vector2, a: Vector2): Vector2 {
            out[0] = Math.round(a[0]);
            out[1] = Math.round(a[1]);
            return out;
        }

        /**
         * Scales a Vector2 by a scalar number
         *
         * @param {Vector2} out the receiving vector
         * @param {Vector2} a the vector to scale
         * @param {Number} b amount to scale the vector by
         * @returns {Vector2} out
         */
        public static scale = function (out: Vector2, a: Vector2, b: number): Vector2 {
            out[0] = a[0] * b;
            out[1] = a[1] * b;
            return out;
        }

        /**
         * Adds two Vector2's after scaling the second operand by a scalar value
         *
         * @param {Vector2} out the receiving vector
         * @param {Vector2} a the first operand
         * @param {Vector2} b the second operand
         * @param {Number} scale the amount to scale b by before adding
         * @returns {Vector2} out
         */
        public static scaleAndAdd = function (out: Vector2, a: Vector2, b: Vector2, scale: number): Vector2 {
            out[0] = a[0] + (b[0] * scale);
            out[1] = a[1] + (b[1] * scale);
            return out;
        }

        /**
         * Calculates the euclidian distance between two Vector2's
         *
         * @param {Vector2} a the first operand
         * @param {Vector2} b the second operand
         * @returns {Number} distance between a and b
         */
        public static dist = function (a: Vector2, b: Vector2): number {
            let x = b[0] - a[0],
                y = b[1] - a[1];
            return Math.sqrt(x * x + y * y);
        }

        /**
         * Calculates the squared euclidian distance between two Vector2's
         *
         * @param {Vector2} a the first operand
         * @param {Vector2} b the second operand
         * @returns {Number} squared distance between a and b
         */
        public static sqrDist = function (a: Vector2, b: Vector2): number {
            let x = b[0] - a[0],
                y = b[1] - a[1];
            return x * x + y * y;
        }

        /**
         * Calculates the length of a Vector2
         *
         * @param {Vector2} a vector to calculate length of
         * @returns {Number} length of a
         */
        public static len(a: Vector2): number {
            let x = a[0],
                y = a[1];
            return Math.sqrt(x * x + y * y);
        }

        /**
         * Calculates the squared length of a Vector2
         *
         * @param {Vector2} a vector to calculate squared length of
         * @returns {Number} squared length of a
         */
        public static sqrLen(a: Vector2): number {
            let x = a[0],
                y = a[1];
            return x * x + y * y;
        }

        /**
         * Negates the components of a Vector2
         *
         * @param {Vector2} out the receiving vector
         * @param {Vector2} a vector to negate
         * @returns {Vector2} out
         */
        public static negate(out: Vector2, a: Vector2): Vector2 {
            out[0] = -a[0];
            out[1] = -a[1];
            return out;
        }

        /**
         * Returns the inverse of the components of a Vector2
         *
         * @param {Vector2} out the receiving vector
         * @param {Vector2} a vector to invert
         * @returns {Vector2} out
         */
        public static inverse(out: Vector2, a: Vector2): Vector2 {
            out[0] = 1.0 / a[0];
            out[1] = 1.0 / a[1];
            return out;
        }

        /**
         * Normalize a Vector2
         *
         * @param {Vector2} out the receiving vector
         * @param {Vector2} a vector to normalize
         * @returns {Vector2} out
         */
        public static normalize(out: Vector2, a: Vector2): Vector2 {
            let x = a[0],
                y = a[1];
            let len = x * x + y * y;
            if (len > 0) {
                //TODO: evaluate use of glm_invsqrt here?
                len = 1 / Math.sqrt(len);
                out[0] = a[0] * len;
                out[1] = a[1] * len;
            }
            return out;
        }

        /**
         * Calculates the dot product of two Vector2's
         *
         * @param {Vector2} a the first operand
         * @param {Vector2} b the second operand
         * @returns {Number} dot product of a and b
         */
        public static dot(a: Vector2, b: Vector2): number {
            return a[0] * b[0] + a[1] * b[1];
        }

        /**
         * Computes the cross product of two Vector2's
         * Note that the cross product must by definition produce a 3D vector
         *
         * @param {vec3} out the receiving vector
         * @param {Vector2} a the first operand
         * @param {Vector2} b the second operand
         * @returns {vec3} out
         */
        /*
        Vector2.cross = function(out, a, b) {
            let z = a[0] * b[1] - a[1] * b[0];
            out[0] = out[1] = 0;
            out[2] = z;
            return out;
        }
        */

        /**
         * Performs a linear interpolation between two Vector2's
         *
         * @param {Vector2} out the receiving vector
         * @param {Vector2} a the first operand
         * @param {Vector2} b the second operand
         * @param {Number} t interpolation amount between the two inputs
         * @returns {Vector2} out
         */
        public static lerp(out: Vector2, a: Vector2, b: Vector2, t: number): Vector2 {
            let ax = a[0],
                ay = a[1];
            out[0] = ax + t * (b[0] - ax);
            out[1] = ay + t * (b[1] - ay);
            return out;
        }

        /**
         * Generates a random vector with the given scale
         *
         * @param {Vector2} out the receiving vector
         * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
         * @returns {Vector2} out
         */
        public static random(out: Vector2, scale: number): Vector2 {
            let r = Math.random() * 2.0 * Math.PI;
            out[0] = Math.cos(r) * scale;
            out[1] = Math.sin(r) * scale;
            return out;
        }

        /**
         * Transforms the Vector2 with a Matrix2
         *
         * @param {Vector2} out the receiving vector
         * @param {Vector2} a the vector to transform
         * @param {Matrix2} m matrix to transform with
         * @returns {Vector2} out
         */
        public static transformMat2(out: Vector2, a: Vector2, m: Matrix2): Vector2 {
            let x = a[0],
                y = a[1];
            out[0] = m[0] * x + m[2] * y;
            out[1] = m[1] * x + m[3] * y;
            return out;
        }

        /**
         * Transforms the Vector2 with a Matrix2d
         *
         * @param {Vector2} out the receiving vector
         * @param {Vector2} a the vector to transform
         * @param {Matrix2d} m matrix to transform with
         * @returns {Vector2} out
         */
        public static transformMat2d(out: Vector2, a: Vector2, m: Matrix2d): Vector2 {
            let x = a[0],
                y = a[1];
            out[0] = m[0] * x + m[2] * y + m[4];
            out[1] = m[1] * x + m[3] * y + m[5];
            return out;
        }

        /**
         * Transforms the Vector2 with a mat3
         * 3rd vector component is implicitly '1'
         *
         * @param {Vector2} out the receiving vector
         * @param {Vector2} a the vector to transform
         * @param {mat3} m matrix to transform with
         * @returns {Vector2} out
         */
        public static transformMat3 = function (out: Vector2, a: Vector2, m: Matrix3): Vector2 {
            let x = a[0],
                y = a[1];
            out[0] = m[0] * x + m[3] * y + m[6];
            out[1] = m[1] * x + m[4] * y + m[7];
            return out;
        }

        /**
         * Transforms the Vector2 with a mat4
         * 3rd vector component is implicitly '0'
         * 4th vector component is implicitly '1'
         *
         * @param {Vector2} out the receiving vector
         * @param {Vector2} a the vector to transform
         * @param {mat4} m matrix to transform with
         * @returns {Vector2} out
         */
        /*
        Vector2.transformMat4 = function(out, a, m) {
            let x = a[0], 
                y = a[1];
            out[0] = m[0] * x + m[4] * y + m[12];
            out[1] = m[1] * x + m[5] * y + m[13];
            return out;
        }
        */

        /**
         * Perform some operation over an array of vec2s.
         *
         * @param {Array} a the array of vectors to iterate over
         * @param {Number} stride Number of elements between the start of each Vector2. If 0 assumes tightly packed
         * @param {Number} offset Number of elements to skip at the beginning of the array
         * @param {Number} count Number of vec2s to iterate over. If 0 iterates over entire array
         * @param {Function} fn Function to call for each vector in the array
         * @param {Object} [arg] additional argument to pass to fn
         * @returns {Array} a
         * @function
         */
        /*
        Vector2.forEach = (function() {
            let vec = Vector2.create();

            return function(a, stride, offset, count, fn, arg) {
                let i, l;
                if(!stride) {
                    stride = 2;
                }

                if(!offset) {
                    offset = 0;
                }
                
                if(count) {
                    l = Math.min((count * stride) + offset, a.length);
                } else {
                    l = a.length;
                }

                for(i = offset; i < l; i += stride) {
                    vec[0] = a[i]; vec[1] = a[i+1];
                    fn(vec, vec, arg);
                    a[i] = vec[0]; a[i+1] = vec[1];
                }
                
                return a;
            }
        })();
        */

        /**
         * Returns a string representation of a vector
         *
         * @param {Vector2} a vector to represent as a string
         * @returns {String} string representation of the vector
         */
        public static toString(a:Vector2) {
            return 'Vector2(' + a[0].toFixed(2) + ', ' + a[1].toFixed(2) + ')';
        }

        /**
         * Returns whether or not the vectors exactly have the same elements in the same position (when compared with ===)
         *
         * @param {Vector2} a The first vector.
         * @param {Vector2} b The second vector.
         * @returns {Boolean} True if the vectors are equal, false otherwise.
         */
        public static exactEquals(a: Vector2, b: Vector2): boolean {
            return a[0] === b[0] && a[1] === b[1];
        }

        /**
         * Returns whether or not the vectors have approximately the same elements in the same position.
         *
         * @param {Vector2} a The first vector.
         * @param {Vector2} b The second vector.
         * @returns {Boolean} True if the vectors are equal, false otherwise.
         */
        public static equals(a: Vector2, b: Vector2): boolean {
            let a0 = a[0], a1 = a[1];
            let b0 = b[0], b1 = b[1];
            return (Math.abs(a0 - b0) <= SMath.EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
                Math.abs(a1 - b1) <= SMath.EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)));
        }

    }
}
