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
            this._image.src = imageSrc;
            this._image.addEventListener('load', () => this.onImageLoadComplete());
        }

        private onImageLoadComplete() {
            var gl = this.gl;
            var texture = this._texture;
            var image = this._image;

            // Now that the image has loaded make copy it to the texture.
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

            //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
 
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_NEAREST);

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
            var gl = this.gl;
            gl.bindTexture(gl.TEXTURE_2D, this._texture);
        }
    }
}