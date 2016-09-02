/// <reference path="Loader.ts" />
/// <reference path="RenderTextureLoader.ts" />
/// <reference path="XmlLoader.ts" />
/// <reference path="../Render/RenderSpriteAtlas.ts" />

module s2d {

    export class RenderSpriteAtlasLoader extends Loader<RenderSpriteAtlas> {
        
        private _spriteAtlasXmlUrl:string = null;
        private _spriteAtlasJson:any = null;
        
        public constructor(id:string, spriteAtlasXmlUrl:string) {
            super(id);
            this._spriteAtlasXmlUrl = spriteAtlasXmlUrl;
        }
                
        protected onStart() : void {
            loader.loadXmlFromUrl(this.id + "_xml", this._spriteAtlasXmlUrl, this.onXmlLoadComplete, this);
        }

        private onXmlLoadComplete(xmlLoader:Loader<string>) {
            let xml = xmlLoader.asset;

            this._spriteAtlasJson = JXON.stringToJs(xml);

            let url = "assets/" + this._spriteAtlasJson.atlas.info.$file;

            loader.loadRenderTextureFromUrl(this.id + "_texture", url, true, this.onTextureLoadComplete, this);
        }

        private onTextureLoadComplete(textureLoader:Loader<RenderTexture>) {
            let atlas = new RenderSpriteAtlas(textureLoader.asset, this._spriteAtlasJson);
            this._spriteAtlasJson = null;
            this.setAsset(atlas);            
        }
    }
}
