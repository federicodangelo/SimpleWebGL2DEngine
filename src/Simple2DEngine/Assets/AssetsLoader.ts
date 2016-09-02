/// <reference path="../Render/RenderTexture.ts" />
/// <reference path="../Render/RenderSprite.ts" />
/// <reference path="../Render/RenderSpriteAtlas.ts" />
/// <reference path="../Render/RenderFont.ts" />
/// <reference path="../Event/Event.ts" />

module s2d {
    export class AssetsLoader {
        private _onLoadComplete:VoidEvent = new VoidEvent();

        private _loaders:StringDictionary<Loader<any>> = new StringDictionary<Loader<any>>();
        private _assets:StringDictionary<any> = new StringDictionary<any>();
        private _dispatchComplete:boolean = false;
        
        public get onLoadComplete() {
            return this._onLoadComplete;
        }

        public init() {
            
        }

        public getAsset(id:string) : any {
            return this._assets.get(id);
        } 

        public loadRenderTextureFromUrl(id:string, url:string, hasAlpha:boolean, onLoadComplete:(loader:Loader<RenderTexture>) => void = null, onLoadCompleteBoundTo:Object = null) {

            if (!this.validateId(id))
                return;

            var loader = new RenderTextureLoader(id, url, hasAlpha)
            loader.onLoadComplete.attach(this.onLoaderComplete, this);
            if (onLoadComplete !== null)
                loader.onLoadComplete.attach(onLoadComplete, onLoadCompleteBoundTo);
            this._loaders.add(id, loader);
            loader.start();
        }

        public loadRenderTextureFromBase64(id:string, base64:string, hasAlpha:boolean, onLoadComplete:(loader:Loader<RenderTexture>) => void = null, onLoadCompleteBoundTo:Object = null) {

            if (!this.validateId(id))
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
            if (!this.validateId(id))
                return;

            var loader = new XmlLoader(id, url);
            loader.onLoadComplete.attach(this.onLoaderComplete, this);
            if (onLoadComplete !== null)
                loader.onLoadComplete.attach(onLoadComplete, onLoadCompleteBoundTo);
            this._loaders.add(id, loader);
            loader.start();
        }

        public loadRenderSpriteAtlasFromUrl(id:string, url:string, onLoadComplete:(loader:Loader<RenderSpriteAtlas>) => void = null, onLoadCompleteBoundTo:Object = null) {
            if (!this.validateId(id))
                return;

            var loader = new RenderSpriteAtlasLoader(id, url);
            loader.onLoadComplete.attach(this.onLoaderComplete, this);
            if (onLoadComplete !== null)
                loader.onLoadComplete.attach(onLoadComplete, onLoadCompleteBoundTo);
            this._loaders.add(id, loader);
            loader.start();
        }

        public loadRenderFontFromUrl(id:string, url:string, onLoadComplete:(loader:Loader<RenderFont>) => void = null, onLoadCompleteBoundTo:Object = null) {
            if (!this.validateId(id))
                return;

            var loader = new RenderFontLoader(id, url);
            loader.onLoadComplete.attach(this.onLoaderComplete, this);
            if (onLoadComplete !== null)
                loader.onLoadComplete.attach(onLoadComplete, onLoadCompleteBoundTo);
            this._loaders.add(id, loader);
            loader.start();
        }

        public loadImageFromUrl(id:string, url:string, onLoadComplete:(loader:Loader<HTMLImageElement>) => void = null, onLoadCompleteBoundTo:Object = null) {
            if (!this.validateId(id))
                return;

            var loader = new ImageLoader(id, url);
            loader.onLoadComplete.attach(this.onLoaderComplete, this);
            if (onLoadComplete !== null)
                loader.onLoadComplete.attach(onLoadComplete, onLoadCompleteBoundTo);
            this._loaders.add(id, loader);
            loader.start();
        }

        private validateId(id:string) {
            if (this._loaders.has(id)) {
                EngineConsole.error("Asset with id " + id + " is already loading");
                return false;
            }

            if (this._assets.has(id)) {
                EngineConsole.error("Asset with id " + id + " is already loaded");
                return false;
            }

            return true;            
        }

        private onLoaderComplete(loader: Loader<any>) {
            this._loaders.remove(loader.id);
            this._assets.add(loader.id, loader.asset);
            this.dispatchCompleteIfFinished();
        }

        private dispatchCompleteIfFinished() : void {
            if (this._loaders.empty) {
                //Real event dispatch is delayed to update() method, to have a
                //predictable dispatch order
                this._dispatchComplete = true;
            }
        }

        public update() {
            if (this._dispatchComplete) {
                this._dispatchComplete = false;

                //We validate if it's still empty, just in case that some asset was added to download
                //between the time when _dispatchComplete was set true and the call to update()
                if (this._loaders.empty)
                    this.onLoadComplete.post();
            }
        }
    }
}
