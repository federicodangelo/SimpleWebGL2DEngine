module s2d {
    export class SMath {
        public static deg2rad = Math.PI / 180;
        public static rad2deg = 180 / Math.PI;

        public static EPSILON = 0.000001;

        public static equals = function (a: number, b: number) {
            return Math.abs(a - b) <= SMath.EPSILON * Math.max(1.0, Math.abs(a), Math.abs(b));
        }        

        public static clamp(v:number, min:number, max:number) {
            if (v < min)
                return min;
            else if (v > max)
                return max;
            return v;
        }

        public static randomInRangeFloat(min:number, max:number) {
            return min + Math.random() * (max - min); 
        }

        public static randomInRangeInteger(min:number, max:number) {
            return Math.floor(min + Math.random() * (max - min)); 
        }
    }
}