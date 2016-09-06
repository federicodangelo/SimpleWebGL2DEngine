/// <reference path="../Render/RenderSprite.ts" />

module s2d {
    export class Tile {
        private _id:string = null;
        private _sprite:RenderSprite = null;

        public get sprite(): RenderSprite {
            return this._sprite;
        }

        public get id(): string {
            return this._id;
        }

        public constructor(id: string, sprite:RenderSprite) {
            this._id = id;
            this._sprite = sprite;
        }
    }
}