/// <reference path="RenderSprite.ts" />
/// <reference path="../Util/Dictionary.ts" />

module s2d {
    export class RenderSpriteAtlas {

        private _texture: RenderTexture = null;

        private _sprites: StringDictionary<RenderSprite> = new StringDictionary<RenderSprite>();

        private _xhttp: XMLHttpRequest = null;
        private _loadCompleteCallback: (atlas:RenderSpriteAtlas) => void = null;
        private _loadCompleteCallbackThis: any = null;

        public get texture() {
            return this._texture;
        }

        public sprites() {
            return this._sprites;
        }

        public constructor() {

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

        public loadFromEmbeddedData(textureAtlasXml: string, textureBase64: string, onLoadComplete:(texture:RenderSpriteAtlas) => void = null, onLoadCompleteThis:any = null) {

            this._loadCompleteCallback = onLoadComplete;
            this._loadCompleteCallbackThis = onLoadCompleteThis;
            this._texture = new RenderTexture(true) .loadFromEmbeddedData(textureBase64, this.onTextureLoadComplete, this);
            this.parseTextureAtlasXml(textureAtlasXml);
            return this;
        }

        public loadFromUrl(textureAtlasXmlURL: string, onLoadComplete:(texture:RenderSpriteAtlas) => void = null, onLoadCompleteThis:any = null) {

            this._loadCompleteCallback = onLoadComplete;
            this._loadCompleteCallbackThis = onLoadCompleteThis;
            
            this._xhttp = new XMLHttpRequest();
            this._xhttp.addEventListener('load', () => this.onXMLLoadComplete());
            this._xhttp.open("GET", textureAtlasXmlURL, true);
            this._xhttp.send(null);
            return this;
        }

        private onXMLLoadComplete(): void {
            //Create the texture before parsing the texture atlas, so every sprite already
            //has a reference to the texture
            this._texture = new RenderTexture(true);
            let atlasData = this.parseTextureAtlasXml(this._xhttp.responseText);
            this._xhttp = null;
            this._texture.loadFromUrl("assets/" + atlasData.atlas.info.$file, this.onTextureLoadComplete, this);
        }

        private onTextureLoadComplete() {
            var tmpCallback = this._loadCompleteCallback;
            var tmpThis = this._loadCompleteCallbackThis;
            this._loadCompleteCallback = null;
            this._loadCompleteCallbackThis = null;
            if (tmpCallback)
                tmpCallback.call(tmpThis, this);
        }

        private parseTextureAtlasXml(xml: string): any {
            var atlasData = JXON.stringToJs(xml);

            let spritesJson: Array<any> = atlasData.atlas.sprites.sprite;

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

            return atlasData;
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
