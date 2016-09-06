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

        public constructor(image:HTMLImageElement, hasAlpha: boolean) {

            let gl = renderer.gl;

            this._hasAlpha = hasAlpha;
            this._texture = gl.createTexture();

            let texture = this._texture;

            gl.bindTexture(gl.TEXTURE_2D, texture);

            this._width = image.width;
            this._height = image.height;

            // Now that the image has loaded make copy it to the texture.
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

            //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_NEAREST);

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

            //Ignore errors for NPOT textures
            gl.generateMipmap(gl.TEXTURE_2D);
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