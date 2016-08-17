module Simple2DEngine {
    export class RenderProgram {

        private gl: WebGLRenderingContext;
        private _program: WebGLProgram;
        private _vertexShader: RenderShader;
        private _fragmentShader: RenderShader;
        private _linkOk: boolean;

        public constructor(gl: WebGLRenderingContext, vertexShaderStr: string, fragmentShaderStr: string) {

            this.gl = gl;

            this._vertexShader = new RenderShader(gl, vertexShaderStr, gl.VERTEX_SHADER);
            this._fragmentShader = new RenderShader(gl, fragmentShaderStr, gl.FRAGMENT_SHADER);

            this._program = gl.createProgram();
            gl.attachShader(this._program, this._vertexShader.shader);
            gl.attachShader(this._program, this._fragmentShader.shader);
            gl.linkProgram(this._program);

            this._linkOk = gl.getProgramParameter(this._program, gl.LINK_STATUS);

            if (!this._linkOk) {
                console.error("Error compiling program: " + gl.getProgramInfoLog(this._program));
                this.clear();
            }
        }

        public clear() {
            if (this._program != null) {
                this.gl.deleteProgram(this._program);
                this._program = null;
            }

            if (this._vertexShader != null) {
                this._vertexShader.clear();
                this._vertexShader = null;
            }

            if (this._fragmentShader != null) {
                this._fragmentShader.clear();
                this._fragmentShader = null;
            }
        }

        public useProgram() {
            this.gl.useProgram(this._program);
        }

        public setUniform2f(name: string, x: number, y: number) {
            var uniformLocation = this.gl.getUniformLocation(this._program, name);
            this.gl.uniform2f(uniformLocation, x, y);
        }

        public setVertexAttributePointer(name: string, buffer: RenderBuffer, size: number, type: number, normalized: boolean, stride: number, offset: number) {

            var attributeLocation = this.gl.getAttribLocation(this._program, name);
            this.gl.enableVertexAttribArray(attributeLocation);

            buffer.bind();

            this.gl.vertexAttribPointer(
                attributeLocation,
                size,
                type,
                normalized,
                stride,
                offset
            );
        }

    }

}