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
        private _rect: Rect = Rect.create();
        
        private _size: Vector2 = Vector2.create();
        
        private _innerUvRect: Rect = null;
        private _innerRect: Rect = null;

        private _drawMode: RenderSpriteDrawMode = RenderSpriteDrawMode.Normal;

        public get id() {
            return this._id;
        }

        public get texture() {
            return this._texture;
        }

        public get rect() {
            return this._rect;
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

        public get innerRect() {
            return this._innerRect;
        
    }
        public get size() {
            return this._size;
        }

        public constructor(id: string, texture: RenderTexture, rect: Rect, drawMode: RenderSpriteDrawMode = RenderSpriteDrawMode.Normal, innerRect: Rect = null) {
            this._id = id;
            this._texture = texture;
            Rect.copy(this._rect, rect);
            Vector2.set(this._size, rect[2], rect[3]);

            this._uvRect[0] = rect[0] / texture.width;
            this._uvRect[1] = rect[1] / texture.height;
            this._uvRect[2] = rect[2] / texture.width;
            this._uvRect[3] = rect[3] / texture.height;

            this._drawMode = drawMode;

            if (innerRect !== null) {
                this._innerRect = Rect.create();
                Rect.copy(this._innerRect, innerRect);
                
                this._innerUvRect = Rect.create();
                this._innerUvRect[0] = innerRect[0] / texture.width;
                this._innerUvRect[1] = innerRect[1] / texture.height;
                this._innerUvRect[2] = innerRect[2] / texture.width;
                this._innerUvRect[3] = innerRect[3] / texture.height;
            }

            if (drawMode !== RenderSpriteDrawMode.Normal && this._innerUvRect === null)
                EngineConsole.error("Missing innerUvRect for draw mode " + drawMode, this);
        }
    }
}
