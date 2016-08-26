/// <reference path="RenderShader.ts" />

module s2d {
    export class RenderProgram {

        private _program: WebGLProgram;
        private _vertexShader: RenderShader;
        private _fragmentShader: RenderShader;
        private _linkOk: boolean;

        public constructor(vertexShaderStr: string, fragmentShaderStr: string) {
            let gl = renderer.gl;

            this._vertexShader = new RenderShader(vertexShaderStr, gl.VERTEX_SHADER);
            this._fragmentShader = new RenderShader(fragmentShaderStr, gl.FRAGMENT_SHADER);

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
            let gl = renderer.gl;

            if (this._program != null) {
                gl.deleteProgram(this._program);
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
            let gl = renderer.gl;
            gl.useProgram(this._program);
        }

        public setUniform2f(name: string, x: number, y: number) {

            let gl = renderer.gl;
            var uniformLocation = gl.getUniformLocation(this._program, name);
            gl.uniform2f(uniformLocation, x, y);
        }

        public setVertexAttributePointer(name: string, buffer: RenderBuffer, size: number, type: number, normalized: boolean, stride: number, offset: number) {

            let gl = renderer.gl;
            var attributeLocation = gl.getAttribLocation(this._program, name);
            gl.enableVertexAttribArray(attributeLocation);

            buffer.bind();

            gl.vertexAttribPointer(
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
