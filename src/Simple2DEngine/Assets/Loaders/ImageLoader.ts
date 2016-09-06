/// <reference path="Loader.ts" />

module s2d {

    export class ImageLoader extends Loader<HTMLImageElement> {

        private _url:string;
        private _image: HTMLImageElement = null;

        public constructor(id:string, url:string) {
            super(id);
            this._url = url;
        }
                
        protected onStart() : void {
            this._image = new Image();
            this._image.setAttribute('crossOrigin', 'anonymous');
            this._image.addEventListener('load', () => this.onImageLoadComplete());
            this._image.src = this._url;
        }

        private onImageLoadComplete() {
            let tmp = this._image;
            this._image = null;
            this.setAsset(tmp);
        }
    }
}
