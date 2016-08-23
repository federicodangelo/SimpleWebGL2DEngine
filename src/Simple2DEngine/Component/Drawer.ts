/// <reference path="Component.ts" />
/// <reference path="../Math/Matrix3.ts" />
/// <reference path="../Math/Vector2.ts" />

module s2d {

    export class Drawer extends Component {

        static tmpMatrix : Matrix3;
        static tmpVector : Vector2;

        public texture : RenderTexture;
        public uvTopLeft : Vector2 = Vector2.fromValues(0, 0);
        public uvBottomRight : Vector2 = Vector2.fromValues(1, 1);
        public color : Color = Color.fromRgba(255, 255, 255, 255);

        static initStatic() {
            Drawer.tmpMatrix = Matrix3.create();
            Drawer.tmpVector = Vector2.create();
        }

        public draw(commands : RenderCommands) : void {
            var trans = this.entity.transform;
            trans.getLocalToGlobalMatrix(Drawer.tmpMatrix);
            commands.drawRect(Drawer.tmpMatrix, trans.halfSize, this.texture, this.uvTopLeft, this.uvBottomRight, this.color);
        }
   }
}