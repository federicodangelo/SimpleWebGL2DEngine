/// <reference path="Component.ts" />
/// <reference path="../Math/Matrix3.ts" />
/// <reference path="../Math/Vector2.ts" />

module Simple2DEngine {

    export class Drawer extends Component {

        static tmpMatrix : Matrix3;
        static tmpVector : Vector2;

        static initStatic() {
            Drawer.tmpMatrix = Matrix3.create();
            Drawer.tmpVector = Vector2.create();
        }

        public draw(commands : RenderCommands) : void {
            var trans = this.entity.transform;
            trans.getLocalToGlobalMatrix(Drawer.tmpMatrix);
            commands.drawRect(Drawer.tmpMatrix, trans.size);
        }
   }
}