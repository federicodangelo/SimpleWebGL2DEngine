/// <reference path="Loader.ts" />
/// <reference path="../../Render/RenderSpriteAtlas.ts" />

module s2d {

    export class RenderSpriteAtlasLoader extends Loader<RenderSpriteAtlas> {
        
        private _spriteAtlasXmlUrl:string = null;
        private _spriteAtlasJson:any = null;
        
        public constructor(id:string, spriteAtlasXmlUrl:string) {
            super(id);
            this._spriteAtlasXmlUrl = spriteAtlasXmlUrl;
        }
                
        protected onStart() : void {
            loader.loadXmlFromUrl(this._spriteAtlasXmlUrl, this._spriteAtlasXmlUrl, this.onXmlLoadComplete, this);
        }

        private onXmlLoadComplete(xmlLoader:Loader<string>) {
            let xml = xmlLoader.asset;

            this._spriteAtlasJson = JXON.stringToJs(xml);

            let url = "assets/" + this._spriteAtlasJson.atlas.info.$file;
            let hasAlpha = true;

            if (typeof this._spriteAtlasJson.atlas.info.$alpha === "string") {
                if ((<string> this._spriteAtlasJson.atlas.info.$alpha).trim().toLowerCase() === "true")
                    hasAlpha = true;
                else
                    hasAlpha = false; 
            }

            loader.loadRenderTextureFromUrl(url, url, hasAlpha, this.onTextureLoadComplete, this);
        }

        private onTextureLoadComplete(textureLoader:Loader<RenderTexture>) {
            let atlas = new RenderSpriteAtlas(textureLoader.asset, this._spriteAtlasJson);
            this._spriteAtlasJson = null;
            this.setAsset(atlas);            
        }
    }
}
