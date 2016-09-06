module s2d {

    export enum LoaderState {
        WaitingStart,
        Loading,
        Complete
    }

    export class Loader<T> {

        private _id:string = null;
        private _onLoadComplete:Event<Loader<T>> = new Event<Loader<T>>();
        private _state:LoaderState = LoaderState.WaitingStart;
        private _asset:T = null;

        public get id() {
            return this._id;
        }

        public get state() {
            return this._state;
        }

        public get asset() {
            return this._asset;
        }

        public get onLoadComplete() {
            return this._onLoadComplete;
        }

        public constructor(id:string) {
            this._id = id;
        }

        public start() {
            if (this._state == LoaderState.WaitingStart) {
                this._state = LoaderState.Loading;
                this.onStart();
            }
        }

        protected onStart() {
            //Must be overriden in subclass to start downloading
        }

        //Must be called by subclass when the asset has finished downloading
        protected setAsset(asset:T) {
            this._asset = asset;
            this._onLoadComplete.post(this);
        }
    }
}