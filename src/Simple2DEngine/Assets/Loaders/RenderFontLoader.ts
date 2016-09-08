/// <reference path="Loader.ts" />
/// <reference path="../../Render/RenderFont.ts" />

module s2d {

    export class RenderFontLoader extends Loader<RenderFont> {
        
        private _fontXmlUrl:string = null;
        private _fontJson:any = null;
        
        public constructor(id:string, fontXmlUrl:string) {
            super(id);
            this._fontXmlUrl = fontXmlUrl;
        }
                
        protected onStart() : void {
            loader.loadXmlFromUrl(this._fontXmlUrl, this._fontXmlUrl, this.onXmlLoadComplete, this);
        }

        private onXmlLoadComplete(xmlLoader:Loader<string>) {
            let xml = xmlLoader.asset;

            this._fontJson = JXON.stringToJs(xml);

            let url = "assets/" + this._fontJson.font.pages.page.$file; 

            loader.loadRenderTextureFromUrl(url, url, true, this.onTextureLoadComplete, this);
        }

        private onTextureLoadComplete(textureLoader:Loader<RenderTexture>) {
            let font = new RenderFont(textureLoader.asset, this._fontJson);
            this._fontJson = null;
            this.setAsset(font);            
        }
    }
}
