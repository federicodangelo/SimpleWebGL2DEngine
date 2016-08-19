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
     * @class 2x2 Matrix
     * @name Matrix2
     */
    export class Matrix2 extends Float32Array {
        /**
         * Creates a new identity Matrix2
         *
         * @returns {Matrix2} a new 2x2 matrix
         */
        public static create(): Matrix2 {
            var a: any = new Float32Array(4);
            a[0] = 1;
            a[1] = 0;
            a[2] = 0;
            a[3] = 1;
            return a;
        }

        /**
         * Creates a new Matrix2 initialized with values from an existing matrix
         *
         * @param {Matrix2} a matrix to clone
         * @returns {Matrix2} a new 2x2 matrix
         */
        public static clone(a: Matrix2): Matrix2 {
            var out = Matrix2.create();
            out[0] = a[0];
            out[1] = a[1];
            out[2] = a[2];
            out[3] = a[3];
            return out;
        }

        /**
         * Copy the values from one Matrix2 to another
         *
         * @param {Matrix2} out the receiving matrix
         * @param {Matrix2} a the source matrix
         * @returns {Matrix2} out
         */
        public static copy(out: Matrix2, a: Matrix2): Matrix2 {
            out[0] = a[0];
            out[1] = a[1];
            out[2] = a[2];
            out[3] = a[3];
            return out;
        }

        /**
         * Set a Matrix2 to the identity matrix
         *
         * @param {Matrix2} out the receiving matrix
         * @returns {Matrix2} out
         */
        public static identity(out: Matrix2): Matrix2 {
            out[0] = 1;
            out[1] = 0;
            out[2] = 0;
            out[3] = 1;
            return out;
        }

        /**
         * Create a new Matrix2 with the given values
         *
         * @param {Number} m00 Component in column 0, row 0 position (index 0)
         * @param {Number} m01 Component in column 0, row 1 position (index 1)
         * @param {Number} m10 Component in column 1, row 0 position (index 2)
         * @param {Number} m11 Component in column 1, row 1 position (index 3)
         * @returns {Matrix2} out A new 2x2 matrix
         */
        public static fromValues(m00: number, m01: number, m10: number, m11: number): Matrix2 {
            var out = Matrix2.create();
            out[0] = m00;
            out[1] = m01;
            out[2] = m10;
            out[3] = m11;
            return out;
        }

        /**
         * Set the components of a Matrix2 to the given values
         *
         * @param {Matrix2} out the receiving matrix
         * @param {Number} m00 Component in column 0, row 0 position (index 0)
         * @param {Number} m01 Component in column 0, row 1 position (index 1)
         * @param {Number} m10 Component in column 1, row 0 position (index 2)
         * @param {Number} m11 Component in column 1, row 1 position (index 3)
         * @returns {Matrix2} out
         */
        public static set(out: Matrix2, m00: number, m01: number, m10: number, m11: number): Matrix2 {
            out[0] = m00;
            out[1] = m01;
            out[2] = m10;
            out[3] = m11;
            return out;
        }


        /**
         * Transpose the values of a Matrix2
         *
         * @param {Matrix2} out the receiving matrix
         * @param {Matrix2} a the source matrix
         * @returns {Matrix2} out
         */
        public static transpose = function (out: Matrix2, a: Matrix2): Matrix2 {
            // If we are transposing ourselves we can skip a few steps but have to cache some values
            if (out === a) {
                var a1 = a[1];
                out[1] = a[2];
                out[2] = a1;
            } else {
                out[0] = a[0];
                out[1] = a[2];
                out[2] = a[1];
                out[3] = a[3];
            }

            return out;
        }

        /**
         * Inverts a Matrix2
         *
         * @param {Matrix2} out the receiving matrix
         * @param {Matrix2} a the source matrix
         * @returns {Matrix2} out
         */
        public static invert(out: Matrix2, a: Matrix2): Matrix2 {
            var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],

                // Calculate the determinant
                det = a0 * a3 - a2 * a1;

            if (!det) {
                return null;
            }
            det = 1.0 / det;

            out[0] = a3 * det;
            out[1] = -a1 * det;
            out[2] = -a2 * det;
            out[3] = a0 * det;

            return out;
        }

        /**
         * Calculates the adjugate of a Matrix2
         *
         * @param {Matrix2} out the receiving matrix
         * @param {Matrix2} a the source matrix
         * @returns {Matrix2} out
         */
        public static adjoint(out: Matrix2, a: Matrix2): Matrix2 {
            // Caching this value is nessecary if out == a
            var a0 = a[0];
            out[0] = a[3];
            out[1] = -a[1];
            out[2] = -a[2];
            out[3] = a0;

            return out;
        }

        /**
         * Calculates the determinant of a Matrix2
         *
         * @param {Matrix2} a the source matrix
         * @returns {Number} determinant of a
         */
        public static determinant(a: Matrix2): number {
            return a[0] * a[3] - a[2] * a[1];
        }

        /**
         * Multiplies two Matrix2's
         *
         * @param {Matrix2} out the receiving matrix
         * @param {Matrix2} a the first operand
         * @param {Matrix2} b the second operand
         * @returns {Matrix2} out
         */
        public static mul(out: Matrix2, a: Matrix2, b: Matrix2): Matrix2 {
            var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
            var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
            out[0] = a0 * b0 + a2 * b1;
            out[1] = a1 * b0 + a3 * b1;
            out[2] = a0 * b2 + a2 * b3;
            out[3] = a1 * b2 + a3 * b3;
            return out;
        }

        /**
         * Rotates a Matrix2 by the given angle
         *
         * @param {Matrix2} out the receiving matrix
         * @param {Matrix2} a the matrix to rotate
         * @param {Number} rad the angle to rotate the matrix by
         * @returns {Matrix2} out
         */
        public static rotate(out: Matrix2, a: Matrix2, rad: number): Matrix2 {
            var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],
                s = Math.sin(rad),
                c = Math.cos(rad);
            out[0] = a0 * c + a2 * s;
            out[1] = a1 * c + a3 * s;
            out[2] = a0 * -s + a2 * c;
            out[3] = a1 * -s + a3 * c;
            return out;
        }

        /**
         * Scales the Matrix2 by the dimensions in the given vec2
         *
         * @param {Matrix2} out the receiving matrix
         * @param {Matrix2} a the matrix to rotate
         * @param {vec2} v the vec2 to scale the matrix by
         * @returns {Matrix2} out
         **/
        public static scale(out: Matrix2, a: Matrix2, v: Vector2): Matrix2 {
            var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],
                v0 = v[0], v1 = v[1];
            out[0] = a0 * v0;
            out[1] = a1 * v0;
            out[2] = a2 * v1;
            out[3] = a3 * v1;
            return out;
        }

        /**
         * Creates a matrix from a given angle
         * This is equivalent to (but much faster than):
         *
         *     Matrix2.identity(dest);
         *     Matrix2.rotate(dest, dest, rad);
         *
         * @param {Matrix2} out Matrix2 receiving operation result
         * @param {Number} rad the angle to rotate the matrix by
         * @returns {Matrix2} out
         */
        public static fromRotation = function (out: Matrix2, rad: number): Matrix2 {
            var s = Math.sin(rad),
                c = Math.cos(rad);
            out[0] = c;
            out[1] = s;
            out[2] = -s;
            out[3] = c;
            return out;
        }

        /**
         * Creates a matrix from a vector scaling
         * This is equivalent to (but much faster than):
         *
         *     Matrix2.identity(dest);
         *     Matrix2.scale(dest, dest, vec);
         *
         * @param {Matrix2} out Matrix2 receiving operation result
         * @param {vec2} v Scaling vector
         * @returns {Matrix2} out
         */
        public static fromScaling(out: Matrix2, v: Vector2): Matrix2 {
            out[0] = v[0];
            out[1] = 0;
            out[2] = 0;
            out[3] = v[1];
            return out;
        }

        /**
         * Returns a string representation of a Matrix2
         *
         * @param {Matrix2} a matrix to represent as a string
         * @returns {String} string representation of the matrix
         */
        public static toString(a: Matrix2) {
            return 'Matrix2(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
        }

        /**
         * Returns Frobenius norm of a Matrix2
         *
         * @param {Matrix2} a the matrix to calculate Frobenius norm of
         * @returns {Number} Frobenius norm
         */
        public static frob(a: Matrix2): number {
            return (Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2)))
        }

        /**
         * Returns L, D and U matrices (Lower triangular, Diagonal and Upper triangular) by factorizing the input matrix
         * @param {Matrix2} L the lower triangular matrix 
         * @param {Matrix2} D the diagonal matrix 
         * @param {Matrix2} U the upper triangular matrix 
         * @param {Matrix2} a the input matrix to factorize
         */

        public static LDU(L: Matrix2, D: Matrix2, U: Matrix2, a: Matrix2): Array<Matrix2> {
            L[2] = a[2] / a[0];
            U[0] = a[0];
            U[1] = a[1];
            U[3] = a[3] - L[2] * U[1];
            return [L, D, U];
        }

        /**
         * Adds two Matrix2's
         *
         * @param {Matrix2} out the receiving matrix
         * @param {Matrix2} a the first operand
         * @param {Matrix2} b the second operand
         * @returns {Matrix2} out
         */
        public static add(out: Matrix2, a: Matrix2, b: Matrix2): Matrix2 {
            out[0] = a[0] + b[0];
            out[1] = a[1] + b[1];
            out[2] = a[2] + b[2];
            out[3] = a[3] + b[3];
            return out;
        }

        /**
         * Subtracts matrix b from matrix a
         *
         * @param {Matrix2} out the receiving matrix
         * @param {Matrix2} a the first operand
         * @param {Matrix2} b the second operand
         * @returns {Matrix2} out
         */
        public static sub(out: Matrix2, a: Matrix2, b: Matrix2): Matrix2 {
            out[0] = a[0] - b[0];
            out[1] = a[1] - b[1];
            out[2] = a[2] - b[2];
            out[3] = a[3] - b[3];
            return out;
        }

        /**
         * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
         *
         * @param {Matrix2} a The first matrix.
         * @param {Matrix2} b The second matrix.
         * @returns {Boolean} True if the matrices are equal, false otherwise.
         */
        public static exactEquals(a: Matrix2, b: Matrix2): boolean {
            return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
        }

        /**
         * Returns whether or not the matrices have approximately the same elements in the same position.
         *
         * @param {Matrix2} a The first matrix.
         * @param {Matrix2} b The second matrix.
         * @returns {Boolean} True if the matrices are equal, false otherwise.
         */
        public static equals(a: Matrix2, b: Matrix2): boolean {
            var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
            var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
            return (Math.abs(a0 - b0) <= SMath.EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
                Math.abs(a1 - b1) <= SMath.EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
                Math.abs(a2 - b2) <= SMath.EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) &&
                Math.abs(a3 - b3) <= SMath.EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3)));
        }

        /**
         * Multiply each element of the matrix by a scalar.
         *
         * @param {Matrix2} out the receiving matrix
         * @param {Matrix2} a the matrix to scale
         * @param {Number} b amount to scale the matrix's elements by
         * @returns {Matrix2} out
         */
        public static multiplyScalar(out: Matrix2, a: Matrix2, b: number): Matrix2 {
            out[0] = a[0] * b;
            out[1] = a[1] * b;
            out[2] = a[2] * b;
            out[3] = a[3] * b;
            return out;
        }

        /**
         * Adds two Matrix2's after multiplying each element of the second operand by a scalar value.
         *
         * @param {Matrix2} out the receiving vector
         * @param {Matrix2} a the first operand
         * @param {Matrix2} b the second operand
         * @param {Number} scale the amount to scale b's elements by before adding
         * @returns {Matrix2} out
         */
        public static multiplyScalarAndAdd(out: Matrix2, a: Matrix2, b: Matrix2, scale: number): Matrix2 {
            out[0] = a[0] + (b[0] * scale);
            out[1] = a[1] + (b[1] * scale);
            out[2] = a[2] + (b[2] * scale);
            out[3] = a[3] + (b[3] * scale);
            return out;
        }
    }
}