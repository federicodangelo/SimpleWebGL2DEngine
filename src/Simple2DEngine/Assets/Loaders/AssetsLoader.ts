/// <reference path="../../Render/RenderTexture.ts" />
/// <reference path="../../Render/RenderSprite.ts" />
/// <reference path="../../Render/RenderSpriteAtlas.ts" />
/// <reference path="../../Render/RenderFont.ts" />
/// <reference path="../../Event/Event.ts" />

module s2d {
    export class AssetsLoader {
        private _onLoadComplete:VoidEvent = new VoidEvent();

        private _loaders:StringDictionary<Loader<any>> = new StringDictionary<Loader<any>>();
        private _assets:StringDictionary<any> = new StringDictionary<any>();
        
        public init() {
            
        }

        public getAsset(id:string) : any {
            return this._assets.get(id);
        } 

        public attachOnLoadCompleteListener(handler: (data: void) => void, boundTo: Object = null): void {
            this._onLoadComplete.attachOnlyOnce(handler, boundTo);
        }

        public loadRenderTextureFromUrl(id:string, url:string, hasAlpha:boolean, onLoadComplete:(loader:Loader<RenderTexture>) => void = null, onLoadCompleteBoundTo:Object = null) {
            if (!this.validateId(id, onLoadComplete, onLoadCompleteBoundTo))
                return;

            var loader = new RenderTextureLoader(id, url, hasAlpha)
            loader.onLoadComplete.attach(this.onLoaderComplete, this);
            if (onLoadComplete !== null)
                loader.onLoadComplete.attach(onLoadComplete, onLoadCompleteBoundTo);
            this._loaders.add(id, loader);
            loader.start();
        }

        public loadRenderTextureFromBase64(id:string, base64:string, hasAlpha:boolean, onLoadComplete:(loader:Loader<RenderTexture>) => void = null, onLoadCompleteBoundTo:Object = null) {
            if (!this.validateId(id, onLoadComplete, onLoadCompleteBoundTo))
                return;

            var url = "data:image/png;base64," + base64;

            var loader = new RenderTextureLoader(id, url, hasAlpha)
            loader.onLoadComplete.attach(this.onLoaderComplete, this);
            if (onLoadComplete !== null)
                loader.onLoadComplete.attach(onLoadComplete, onLoadCompleteBoundTo);
            this._loaders.add(id, loader);
            loader.start();
        }

        public loadXmlFromUrl(id:string, url:string, onLoadComplete:(loader:Loader<string>) => void = null, onLoadCompleteBoundTo:Object = null) {
            if (!this.validateId(id, onLoadComplete, onLoadCompleteBoundTo))
                return;

            var loader = new XmlLoader(id, url);
            loader.onLoadComplete.attach(this.onLoaderComplete, this);
            if (onLoadComplete !== null)
                loader.onLoadComplete.attach(onLoadComplete, onLoadCompleteBoundTo);
            this._loaders.add(id, loader);
            loader.start();
        }

        public loadRenderSpriteAtlasFromUrl(id:string, xmlUrl:string, onLoadComplete:(loader:Loader<RenderSpriteAtlas>) => void = null, onLoadCompleteBoundTo:Object = null) {
            if (!this.validateId(id, onLoadComplete, onLoadCompleteBoundTo))
                return;

            var loader = new RenderSpriteAtlasLoader(id, xmlUrl);
            loader.onLoadComplete.attach(this.onLoaderComplete, this);
            if (onLoadComplete !== null)
                loader.onLoadComplete.attach(onLoadComplete, onLoadCompleteBoundTo);
            this._loaders.add(id, loader);
            loader.start();
        }

        public loadRenderFontFromUrl(id:string, url:string, onLoadComplete:(loader:Loader<RenderFont>) => void = null, onLoadCompleteBoundTo:Object = null) {
            if (!this.validateId(id, onLoadComplete, onLoadCompleteBoundTo))
                return;

            var loader = new RenderFontLoader(id, url);
            loader.onLoadComplete.attach(this.onLoaderComplete, this);
            if (onLoadComplete !== null)
                loader.onLoadComplete.attach(onLoadComplete, onLoadCompleteBoundTo);
            this._loaders.add(id, loader);
            loader.start();
        }

        public loadImageFromUrl(id:string, url:string, onLoadComplete:(loader:Loader<HTMLImageElement>) => void = null, onLoadCompleteBoundTo:Object = null) {
            if (!this.validateId(id, onLoadComplete, onLoadCompleteBoundTo))
                return;

            var loader = new ImageLoader(id, url);
            loader.onLoadComplete.attach(this.onLoaderComplete, this);
            if (onLoadComplete !== null)
                loader.onLoadComplete.attach(onLoadComplete, onLoadCompleteBoundTo);
            this._loaders.add(id, loader);
            loader.start();
        }

        private validateId(id:string, onLoadComplete:(loader:Loader<any>) => void, onLoadCompleteBoundTo:Object) {

            if (this._loaders.has(id)) {
                EngineConsole.info("Asset with id " + id + " is already loading, attaching request to existing loader");
                if (onLoadComplete !== null)
                    this._loaders.get(id).onLoadComplete.attach(onLoadComplete, onLoadCompleteBoundTo);
                return false;
            }

            if (this._assets.has(id)) {
                EngineConsole.info("Asset with id " + id + " is already loaded, dispatching onLoadComplete() with existing asset");
                if (onLoadComplete !== null)
                    onLoadComplete.call(onLoadCompleteBoundTo, this._assets.get(id));
                return false;
            }

            return true;            
        }

        private onLoaderComplete(loader: Loader<any>) {
            this._loaders.remove(loader.id);
            this._assets.add(loader.id, loader.asset);
        }

        public update() {
            if (this._loaders.empty && this._onLoadComplete.listenerCount > 0) {
                this._onLoadComplete.post();
            }
        }
    }
}
