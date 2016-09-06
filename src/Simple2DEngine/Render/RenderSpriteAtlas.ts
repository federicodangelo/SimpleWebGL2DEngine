/// <reference path="RenderSprite.ts" />
/// <reference path="../Util/StringDictionary.ts" />

module s2d {
    export class RenderSpriteAtlas {

        private _texture: RenderTexture = null;

        private _sprites: StringDictionary<RenderSprite> = new StringDictionary<RenderSprite>();

        public get texture() {
            return this._texture;
        }

        public get sprites() {
            return this._sprites;
        }

        public constructor(texture:RenderTexture, atlasJson:any) {
            this._texture = texture;
            this.parseAtlasJson(atlasJson);
        }

        public getSprite(id: string) {
            return this._sprites.get(id);
        }

        public clear() {
            if (this._texture != null) {
                this._texture.clear();
                this._texture = null;
            }
        }

        private parseAtlasJson(atlasJson: any): void {
            
            let spritesJson: Array<any> = atlasJson.atlas.sprites.sprite;

            for (let i = 0; i < spritesJson.length; i++) {
                let spriteJson = spritesJson[i];

                let id = spriteJson.$id;
                let rect = RenderSpriteAtlas.parseRectString(spriteJson.$rect);
                let innerRect = RenderSpriteAtlas.parseRectString(spriteJson.$innerRect);

                if (id && rect) {
                    let sprite: RenderSprite = null;

                    if (innerRect)
                        sprite = new RenderSprite(id, this._texture, rect, RenderSpriteDrawMode.Slice9, innerRect);
                    else
                        sprite = new RenderSprite(id, this._texture, rect);

                    this._sprites.add(sprite.id, sprite);
                }
            }
        }

        private static parseRectString(str: string): Rect {
            var rect: Rect = null;
            if (str && str.length > 0) {
                var strs = str.split(",");
                if (strs.length === 4) {
                    rect = Rect.fromValues(
                        parseInt(strs[0]),
                        parseInt(strs[1]),
                        parseInt(strs[2]),
                        parseInt(strs[3])
                    );
                }
            }
            return rect;
        }
    }
}
