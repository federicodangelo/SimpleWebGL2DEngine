module s2d {
    export class RenderBuffer {
        private gl:WebGLRenderingContext;
        private _buffer : WebGLBuffer;
        private _bufferType : number;

        /**
         * bufferType: gl.ARRAY_BUFFER or gl.ELEMENT_ARRAY_BUFFER
         */
        public constructor(gl:WebGLRenderingContext, bufferType:number = WebGLRenderingContext.ARRAY_BUFFER) {
            this.gl = gl;
            this._bufferType = bufferType
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
            this.gl.bufferData(this._bufferType, data, staticData ? this.gl.STATIC_DRAW : this.gl.DYNAMIC_DRAW);
        }

        public bind() {
            this.gl.bindBuffer(this._bufferType, this._buffer);
        }
    }
}