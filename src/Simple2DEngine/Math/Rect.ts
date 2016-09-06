module s2d {

    /**
     * Rect
     * uses 4 values: x, y, width and height 
     */
    export class Rect extends Float32Array {

        public static create(): Rect {
            let a: any = new Float32Array(4);
            a[0] = 0;
            a[1] = 0;
            a[2] = 0;
            a[3] = 0;
            return a;
        }

        public static clone(a: Rect): Rect {
            let out = Rect.create();
            out[0] = a[0];
            out[1] = a[1];
            out[2] = a[2];
            out[3] = a[3];
            return out;
        }

        public static fromValues(x: number, y: number, width: number, height: number) {
            let out = Rect.create();
            out[0] = x;
            out[1] = y;
            out[2] = width;
            out[3] = height;
            return out;
        }

        public static copy(out: Rect, a: Rect): Rect {
            out[0] = a[0];
            out[1] = a[1];
            out[2] = a[2];
            out[3] = a[3];
            return out;
        }

        public static set(out: Rect, x: number, y: number, width: number, height: number) {
            out[0] = x;
            out[1] = y;
            out[2] = width;
            out[3] = height;
            return out;
        }

        public static containts(rect:Rect, x: number, y: number) {
            let rx = rect[0];
            let ry = rect[1];
            let rwidth = rect[2];
            let rheight = rect[3];

            return x >= rx && x <= rx + rwidth && y >= ry && y <= ry + rheight;
        }
    }
}
