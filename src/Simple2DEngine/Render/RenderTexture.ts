module s2d {
    export class RenderTexture {

        private gl: WebGLRenderingContext;
        private _texture: WebGLTexture;
        private _image: HTMLImageElement;

        public get texture() {
            return this._texture;
        }

        public constructor(gl: WebGLRenderingContext, imageSrc: string) {

            this.gl = gl;

            this._texture = gl.createTexture();

            let texture = this._texture;

            gl.bindTexture(gl.TEXTURE_2D, texture);

            // Fill the texture with a 1x1 white pixel.
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                new Uint8Array([255, 255, 255, 255]));

            // Asynchronously load an image
            this._image = new Image();
            this._image.setAttribute('crossOrigin', 'anonymous');
            this._image.addEventListener('load', () => this.onImageLoadComplete());
            this._image.src = imageSrc;
        }

        private onImageLoadComplete() {
            let gl = this.gl;
            let texture = this._texture;
            let image = this._image;

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
        }

        public clear() {
            if (this._texture != null) {
                this.gl.deleteTexture(this._texture);
                this._texture = null;
            }
        }

        public useTexture() {
            let gl = this.gl;
            gl.bindTexture(gl.TEXTURE_2D, this._texture);
        }
    }
}