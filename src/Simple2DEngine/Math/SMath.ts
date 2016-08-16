module Simple2DEngine {
    export class SMath {
        public static deg2rad = Math.PI / 180;
        public static rad2deg = 180 / Math.PI;

        public static EPSILON = 0.000001;

        public static equals = function (a: number, b: number) {
            return Math.abs(a - b) <= SMath.EPSILON * Math.max(1.0, Math.abs(a), Math.abs(b));
        }        
    }
}