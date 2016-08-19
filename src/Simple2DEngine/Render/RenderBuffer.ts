module s2d {
    export class RenderBuffer {
        private gl:WebGLRenderingContext;
        private _buffer : WebGLBuffer;

        public constructor(gl:WebGLRenderingContext) {
            this.gl = gl;
            this._buffer = gl.createBuffer();
        }

        public clear() {
            if (this._buffer != null) {
                this.gl.deleteBuffer(this._buffer);
                this._buffer = null;
            }
        }

        public setData(data:ArrayBuffer, staticData : boolean) {
            this.bind();
            this.gl.bufferData(this.gl.ARRAY_BUFFER, data, staticData ? this.gl.STATIC_DRAW : this.gl.DYNAMIC_DRAW);
        }

        public bind() {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this._buffer);
        }
    }
}