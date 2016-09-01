module s2d {
    export class RenderVertex {
        public x: number;
        public y: number;
        public color: number;
        public u: number;
        public v: number;

        public copyFrom(v: RenderVertex) : RenderVertex {
            this.x = v.x;
            this.y = v.y;
            this.color = v.color;
            this.u = v.u;
            this.v = v.v;
            return this;
        }

        public transformMat2d(m: Matrix2d): RenderVertex {
            let x = this.x,
                y = this.y;
            this.x = m[0] * x + m[2] * y + m[4];
            this.y = m[1] * x + m[3] * y + m[5];
            return this;
        }

        public setXYUV(x: number, y: number, u: number, v: number): RenderVertex {
            this.x = x;
            this.y = y;
            this.u = u;
            this.v = v;
            return this;
        }
    }
}