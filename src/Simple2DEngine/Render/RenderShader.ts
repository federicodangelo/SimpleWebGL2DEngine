module s2d {
    export class RenderShader {

        private gl : WebGLRenderingContext;
        private _shader : WebGLShader;
        private _compilationOk : boolean;

        public get shader() {
            return this._shader;
        }

        public constructor(gl:WebGLRenderingContext, shaderStr : string, type : number) {

            this.gl = gl;

            this._shader = gl.createShader(type);
            gl.shaderSource(this._shader, shaderStr);
            gl.compileShader(this._shader);

            this._compilationOk = gl.getShaderParameter(this._shader, gl.COMPILE_STATUS);
            
            if (!this._compilationOk) {
                console.error("Error compiling shader: " + shaderStr);
                console.error(gl.getShaderInfoLog(this._shader));
                this.clear();
            }
        }

        public clear() {
            if (this._shader != null) {
                this.gl.deleteShader(this._shader);
                this._shader = null;
            }
        }

    }
}