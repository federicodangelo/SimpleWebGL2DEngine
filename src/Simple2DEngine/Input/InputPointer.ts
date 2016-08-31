module s2d {
    export class InputPointer {
        
        public down: boolean = false;
        public downFrames: number = 0;

        public position: Vector2 = Vector2.create();
        public delta: Vector2 = Vector2.create();
    }
}