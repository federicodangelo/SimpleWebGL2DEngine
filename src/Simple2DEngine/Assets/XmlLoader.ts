/// <reference path="Loader.ts" />

module s2d {

    export class XmlLoader extends Loader<string> {

        private _url:string;
        private _xhttp: XMLHttpRequest = null;

        public constructor(id:string, url:string) {
            super(id);
            this._url = url;
        }
                
        protected onStart() : void {
            this._xhttp = new XMLHttpRequest();
            this._xhttp.addEventListener('load', () => this.onXMLLoadComplete());
            this._xhttp.open("GET", this._url, true);
            this._xhttp.send(null);
        }

        private onXMLLoadComplete(): void {
            let tmp = this._xhttp;
            this._xhttp = null;
            this.setAsset(tmp.responseText);
        }
    }
}
