/// <reference path="Drawer.ts" />

module s2d {
    export class SpriteDrawer extends Drawer {
        private _sprite: RenderSprite = null;
        private _color: Color = Color.fromRgba(255, 255, 255, 255);

        public get sprite(): RenderSprite {
            return this._sprite;
        }

        public set sprite(value: RenderSprite) {
            this._sprite = value;
        }

        public get color(): Color {
            return this._color;
        }

        public set color(value: Color) {
            this._color.copyFrom(value);
        }

        public draw(commands: RenderCommands): void {
            let sprite = this._sprite;

            if (sprite !== null && sprite.texture !== null) {
                let trans = this.entity.transform;
                trans.getLocalToGlobalMatrix(Drawer.tmpMatrix);
                let color = this._color;

                switch (sprite.drawMode) {
                    case RenderSpriteDrawMode.Normal:
                        commands.drawRectSimple(Drawer.tmpMatrix, trans.size, trans.pivot, sprite.texture, sprite.uvRect, this._color);
                        break;

                    case RenderSpriteDrawMode.Slice9:
                        commands.drawRect9Slice(Drawer.tmpMatrix, trans.size, trans.pivot, sprite.texture, sprite.rect, sprite.uvRect, sprite.innerRect, sprite.innerUvRect, this._color);
                        break;
                }
            }
        }
    }
}
