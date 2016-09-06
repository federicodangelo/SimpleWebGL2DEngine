/// <reference path="Loader.ts" />
/// <reference path="../../Render/RenderTexture.ts" />

module s2d {

    export class RenderTextureLoader extends Loader<RenderTexture> {
        
        private _url:string = null;
        private _hasAlpha: boolean = false;

        public constructor(id:string, url:string, hasAlpha:boolean) {
            super(id);
            this._url = url;
            this._hasAlpha = hasAlpha;
        }
                
        protected onStart() : void {
            loader.loadImageFromUrl(this.id + "_image", this._url, this.onImageLoadComplete, this);
        }

        private onImageLoadComplete(imageLoader:Loader<HTMLImageElement>) {
            let texture = new RenderTexture(imageLoader.asset, this._hasAlpha);
            this.setAsset(texture);
        }
    }
}