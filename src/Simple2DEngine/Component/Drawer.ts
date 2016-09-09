/// <reference path="Component.ts" />
/// <reference path="../Math/Matrix3.ts" />
/// <reference path="../Math/Vector2.ts" />

module s2d {

    export class Drawer extends Component {

        static tmpMatrix : Matrix2d;
        static tmpVector : Vector2;

        static initStatic() {
            Drawer.tmpMatrix = Matrix2d.create();
            Drawer.tmpVector = Vector2.create();
        }

        public draw(commands : RenderCommands) : void {
            
        }

        public getBestSize() : Vector2 {
            return this.entity.transform.size;
        }
   }
}