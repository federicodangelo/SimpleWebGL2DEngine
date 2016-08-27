/// <reference path="Component.ts" />
/// <reference path="../Math/Matrix3.ts" />
/// <reference path="../Math/Vector2.ts" />

module s2d {

    export class TextureDrawer extends Drawer {

        private _texture: RenderTexture;
        private _color: Color = Color.fromRgba(255, 255, 255, 255);

        private _uvTopLeft: Vector2 = Vector2.fromValues(0, 0);
        private _uvBottomRight: Vector2 = Vector2.fromValues(1, 1);

        public get texture(): RenderTexture {
            return this._texture;
        }

        public set texture(value: RenderTexture) {
            this._texture = value;
        }

        public get color(): Color {
            return this._color;
        }

        public set color(value: Color) {
            this._color = value;
        }

        public get uvTopLeft(): Vector2 {
            return this._uvTopLeft;
        }

        public set uvTopLeft(value: Vector2) {
            this._uvTopLeft = value;
        }

        public get uvBottomRight(): Vector2 {
            return this._uvBottomRight;
        }

        public set uvBottomRight(value: Vector2) {
            this._uvBottomRight = value;
        }

        public draw(commands: RenderCommands): void {
            var trans = this.entity.transform;
            trans.getLocalToGlobalMatrix(Drawer.tmpMatrix);
            commands.drawRectSimple(Drawer.tmpMatrix, trans.size, trans.pivot, this._texture, this._uvTopLeft, this._uvBottomRight, this._color);
        }
    }
}