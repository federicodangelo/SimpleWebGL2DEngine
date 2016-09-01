/// <reference path="RenderTexture.ts" />

module s2d {

    export enum RenderSpriteDrawMode {
        Normal,
        Slice9
    }

    export class RenderSprite {
        private _id: string = null;
        private _texture: RenderTexture = null;
        private _uvRect: Rect = Rect.create();
        private _innerUvRect: Rect = null;
        private _drawMode: RenderSpriteDrawMode = RenderSpriteDrawMode.Normal;

        public get id() {
            return this._id;
        }

        public get texture() {
            return this._texture;
        }

        public get uvRect() {
            return this._uvRect;
        }

        public get drawMode() {
            return this._drawMode;
        }

        public get innerUvRect() {
            return this._innerUvRect;
        }

        public constructor(id: string, texture: RenderTexture, uvRect: Rect, drawMode: RenderSpriteDrawMode = RenderSpriteDrawMode.Normal, innerUvRect: Rect = null) {
            this._id = id;
            this._texture = texture;
            Rect.copy(this._uvRect, uvRect);
            this._drawMode = drawMode;

            if (innerUvRect !== null) {
                this._innerUvRect = Rect.create();
                Rect.copy(this._innerUvRect, innerUvRect);
            }

            if (drawMode !== RenderSpriteDrawMode.Normal && this._innerUvRect === null)
                EngineConsole.error("Missing innerUvRect for draw mode " + drawMode, this);
        }
    }
}
