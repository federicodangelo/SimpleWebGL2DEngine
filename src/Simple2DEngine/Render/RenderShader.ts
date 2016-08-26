module s2d {
    export class RenderShader {

        private _shader : WebGLShader;
        private _compilationOk : boolean;

        public get shader() {
            return this._shader;
        }

        public constructor(shaderStr : string, type : number) {

            let gl = renderer.gl;

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
            let gl = renderer.gl;
            if (this._shader != null) {
                gl.deleteShader(this._shader);
                this._shader = null;
            }
        }

    }
}