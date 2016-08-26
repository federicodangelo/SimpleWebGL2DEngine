/// <reference path="../Util/JXON.d.ts" />


module s2d {

    export class RenderFontCharData {
        public id: number = 0;

        public width: number = 0;
        public height: number = 0;

        public x: number = 0;
        public y: number = 0;

        public xadvance: number = 0;

        public xoffset: number = 0;
        public yoffset: number = 0;

    }

    export class RenderFont {

        private _xhttp: XMLHttpRequest = null;

        private _texture: RenderTexture = null;

        private _textureWidth: number = 0;
        private _textureHeight: number = 0;
        private _lineHeight: number = 0;
        private _chars: Array<RenderFontCharData> = new Array<RenderFontCharData>();

        public get texture() {
            return this._texture;
        }


        public get textureWidth() {
            return this._textureWidth;
        }

        public get textureHeight() {
            return this._textureHeight;
        }

        public get lineHeight() {
            return this._lineHeight;
        }

        public get chars() {
            return this._chars;
        }

        public constructor() {
        }

        public clear() {
            if (this._texture != null) {
                this._texture.clear();
                this._texture = null;
            }
        }

        public loadFromEmbeddedData(fontXml: string, textureBase64: string) {
            this.parseFontXml(fontXml);
            this._texture = new RenderTexture(true).loadFromEmbeddedData(textureBase64);
            return this;
        }

        public loadFromUrl(fontXmlURL: string) {
            this._xhttp = new XMLHttpRequest();
            this._xhttp.addEventListener('load', () => this.onXMLLoadComplete());
            this._xhttp.open("GET", fontXmlURL, true);
            this._xhttp.send(null);
            return this;
        }

        private parseFontXml(xml:string) : any {
            var fontData = JXON.stringToJs(xml);

            this._textureWidth = parseInt(fontData.font.common.$scaleW);
            this._textureHeight = parseInt(fontData.font.common.$scaleH);
            this._lineHeight = parseInt(fontData.font.common.$lineHeight);

            let charsJson: Array<any> = fontData.font.chars.char;

            for (let i = 0; i < charsJson.length; i++) {
                let charJson = charsJson[i];
                let char = new RenderFontCharData();

                char.id = parseInt(charJson.$id);

                char.width = parseInt(charJson.$width);
                char.height = parseInt(charJson.$height);

                char.x = parseInt(charJson.$x);
                char.y = parseInt(charJson.$y);

                char.xadvance = parseInt(charJson.$xadvance);

                char.xoffset = parseInt(charJson.$xoffset);
                char.yoffset = parseInt(charJson.$yoffset);

                this._chars[char.id] = char;
            }

            return fontData;
        }

        private onXMLLoadComplete(): void {
            let fontData = this.parseFontXml(this._xhttp.responseText);
            this._xhttp = null;
            this._texture = new RenderTexture(true).loadFromEmbeddedData("assets/" + fontData.font.pages.page.$file);
        }
    }
}