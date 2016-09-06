module s2d {
    export class RenderBuffer {
        private _buffer : WebGLBuffer;
        private _bufferType : number;

        /**
         * bufferType: gl.ARRAY_BUFFER or gl.ELEMENT_ARRAY_BUFFER
         */
        public constructor(bufferType:number = WebGLRenderingContext.ARRAY_BUFFER) {
            let gl = renderer.gl;
            this._bufferType = bufferType
            this._buffer = gl.createBuffer();
        }

        public clear() {
            let gl = renderer.gl;
            if (this._buffer != null) {
                gl.deleteBuffer(this._buffer);
                this._buffer = null;
            }
        }

        public setData(data:ArrayBuffer, staticData : boolean) {
            let gl = renderer.gl;
            this.bind();
            gl.bufferData(this._bufferType, data, staticData ? gl.STATIC_DRAW : gl.DYNAMIC_DRAW);
        }

        public bind() {
            let gl = renderer.gl;
            gl.bindBuffer(this._bufferType, this._buffer);
        }
    }
}
