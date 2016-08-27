module s2d {
    export class RenderVertex {
        public x : number;
        public y : number;
        public color : number;
        public u : number;
        public v : number;

        public copyFrom(v:RenderVertex) {
            this.x = v.x;
            this.y = v.y;
            this.color = v.color;
            this.u = v.u;
            this.v = v.v;
        }

        public transformMat2d(m: Matrix2d) : void {
            let x = this.x,
                y = this.y;
            this.x = m[0] * x + m[2] * y + m[4];
            this.y = m[1] * x + m[3] * y + m[5];
        }        
    }
}