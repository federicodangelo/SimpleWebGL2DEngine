/// <reference path="Component.ts" />
/// <reference path="../Math/Matrix3.ts" />
/// <reference path="../Math/Vector2.ts" />

module s2d {

    export class TextureDrawer extends Drawer {

        public texture : RenderTexture;
        public uvTopLeft : Vector2 = Vector2.fromValues(0, 0);
        public uvBottomRight : Vector2 = Vector2.fromValues(1, 1);
        public color : Color = Color.fromRgba(255, 255, 255, 255);

        public draw(commands : RenderCommands) : void {
            var trans = this.entity.transform;
            trans.getLocalToGlobalMatrix(Drawer.tmpMatrix);
            commands.drawRect(Drawer.tmpMatrix, trans.halfSize, this.texture, this.uvTopLeft, this.uvBottomRight, this.color);
        }
   }
}