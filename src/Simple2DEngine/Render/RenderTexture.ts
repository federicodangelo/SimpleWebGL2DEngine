module s2d {
    export class RenderTexture {

        private _texture: WebGLTexture = null;
        private _hasAlpha: boolean = false;
        private _width: number = 0;
        private _height: number = 0;

        private _image: HTMLImageElement = null;
        private _loadCompleteCallback: (texture:RenderTexture) => void = null;
        private _loadCompleteCallbackThis: any = null;

        public get texture() {
            return this._texture;
        }

        public get width() {
            return this._width;
        }

        public get height() {
            return this._height;
        }

        public get hasAlpha() {
            return this._hasAlpha;
        }

        public constructor(hasAlpha: boolean) {

            let gl = renderer.gl;
            this._hasAlpha = hasAlpha;
            this._texture = gl.createTexture();

            let texture = this._texture;

            gl.bindTexture(gl.TEXTURE_2D, texture);

            // Fill the texture with a 1x1 white pixel.
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                new Uint8Array([255, 255, 255, 255]));
        }

        public loadFromUrl(imageUrl: string, onLoadComplete:(texture:RenderTexture) => void = null, onLoadCompleteThis:any = null) {

            this._loadCompleteCallback = onLoadComplete;
            this._loadCompleteCallbackThis = onLoadCompleteThis;

            // Asynchronously load an image
            this._image = new Image();
            this._image.setAttribute('crossOrigin', 'anonymous');
            this._image.addEventListener('load', () => this.onImageLoadComplete());
            this._image.src = imageUrl;

            return this;
        }

        public loadFromEmbeddedData(imageBase64: string, onLoadComplete:(texture:RenderTexture) => void = null, onLoadCompleteThis:any = null) {

            this._loadCompleteCallback = onLoadComplete;
            this._loadCompleteCallbackThis = onLoadCompleteThis;

            // Asynchronously load an image
            this._image = new Image();
            this._image.addEventListener('load', () => this.onImageLoadComplete());
            this._image.src = "data:image/png;base64," + imageBase64;
            
            return this;
        }

        private onImageLoadComplete() {
            let gl = renderer.gl;
            let texture = this._texture;
            let image = this._image;

            this._width = image.width;
            this._height = image.height;

            // Now that the image has loaded make copy it to the texture.
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

            //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_NEAREST);

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

            gl.generateMipmap(gl.TEXTURE_2D);

            this._image = null;
            var tmpCallback = this._loadCompleteCallback;
            var tmpThis = this._loadCompleteCallbackThis;
            this._loadCompleteCallback = null;
            this._loadCompleteCallbackThis = null;
            if (tmpCallback)
                tmpCallback.call(tmpThis, this);
        }

        public clear() {
            let gl = renderer.gl;
            if (this._texture != null) {
                gl.deleteTexture(this._texture);
                this._texture = null;
            }
        }

        public useTexture() {
            let gl = renderer.gl;
            gl.bindTexture(gl.TEXTURE_2D, this._texture);
        }
    }
}