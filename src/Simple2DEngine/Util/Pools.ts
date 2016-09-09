module s2d {
    export class Pools {

        public static vector2: Pool<Vector2>;
        public static matrix2d: Pool<Matrix2d>;
        
        public static initPools() {
            Pools.vector2 = new Pool<Vector2>(Vector2.create);
            Pools.matrix2d = new Pool<Matrix2d>(Matrix2d.create);
        } 
    }
}