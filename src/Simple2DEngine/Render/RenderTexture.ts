module s2d {
    export class RenderTexture {

        private gl: WebGLRenderingContext;
        private _texture: WebGLTexture;

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
            /*
            var image = new Image();
            image.src = imageSrc;
            image.addEventListener('load', function() {
                // Now that the image has loaded make copy it to the texture.
                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
                gl.generateMipmap(gl.TEXTURE_2D);
            });
            */
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