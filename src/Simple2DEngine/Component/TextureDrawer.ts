/// <reference path="Drawer.ts" />

module s2d {

    export class TextureDrawer extends Drawer {

        private _texture: RenderTexture = null;
        private _color: Color = Color.fromRgba(255, 255, 255, 255);
        private _uvRect: Rect = Rect.fromValues(0, 0, 1, 1);

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
            this._color.copyFrom(value);
        }

        public get uvRect(): Rect {
            return this._uvRect;
        }

        public set uvRect(value: Rect) {
            Rect.copy(this._uvRect, value);
        }

        public draw(commands: RenderCommands): void {
            if (this._texture !== null) {
                let trans = this.entity.transform;
                trans.getLocalToGlobalMatrix(Drawer.tmpMatrix);
                commands.drawRectSimple(Drawer.tmpMatrix, trans.size, trans.pivot, this._texture, this._uvRect, this._color);
            }
        }
    }
}