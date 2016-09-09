/// <reference path="RenderBuffer.ts" />
/// <reference path="RenderProgram.ts" />

module s2d {
    export class RenderCommands {

        private static vertexShader = `
            attribute vec2 a_position;
            attribute vec4 a_color;
            attribute vec2 a_texcoord;

            // screen resolution
            uniform vec2 u_resolution;

            // color used in fragment shader
            varying vec4 v_color;

            // texture used in vertex shader
            varying vec2 v_texcoord;

            // all shaders have a main function
            void main() {
                // convert the position from pixels to 0.0 to 1.0
                vec2 zeroToOne = a_position / u_resolution;
            
                // convert from 0->1 to 0->2
                vec2 zeroToTwo = zeroToOne * 2.0;
            
                // convert from 0->2 to -1->+1 (clipspace)
                vec2 clipSpace = zeroToTwo - 1.0;

                // vertical flip, so top/left is (0,0)
                gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1); 
                //gl_Position = vec4(clipSpace, 0, 1);

                // pass vertex color to fragment shader
                v_color = a_color;

                v_texcoord = a_texcoord;
            }
        `;

        private static fragmentShader = `
            // fragment shaders don't have a default precision so we need
            // to pick one. mediump is a good default
            precision mediump float;

            //color received from vertex shader
            varying vec4 v_color;

            //texture uv received from vertex shader
            varying vec2 v_texcoord;

            // Main texture.
            uniform sampler2D u_texture;

            void main() {

                gl_FragColor = texture2D(u_texture, v_texcoord) * v_color;

                //gl_FragColor = v_color;
            }
        `;

        private renderProgram: RenderProgram;

        static BUFFERS_COUNT = 16;

        private renderVertexBuffers: Array<RenderBuffer>; //Use in round-robing fashion to prevent stalls in rendering due to render buffer reuse in same frame
        private renderIndexBuffers: Array<RenderBuffer>; //Use in round-robing fashion to prevent stalls in rendering due to render buffer reuse in same frame

        private currentBufferIndex = 0;

        private currentTexture: RenderTexture = null;
        private renderMesh: RenderMesh = null;

        public constructor() {
            let gl = renderer.gl;
            this.renderProgram = new RenderProgram(RenderCommands.vertexShader, RenderCommands.fragmentShader);

            this.renderVertexBuffers = new Array<RenderBuffer>();
            this.renderIndexBuffers = new Array<RenderBuffer>();
            for (let i = 0; i < RenderCommands.BUFFERS_COUNT; i++) {
                this.renderVertexBuffers.push(new RenderBuffer(gl.ARRAY_BUFFER));
                this.renderIndexBuffers.push(new RenderBuffer(gl.ELEMENT_ARRAY_BUFFER));
            }

            this.renderMesh = new RenderMesh();
        }

        public startFrame() {

        }

        public endFrame() {

        }

        public start() {
            this.renderMesh.reset();
        }

        public drawRectSimple(mat: Matrix2d, size: Vector2, texture: RenderTexture, uvRect: Rect, color: Color): void {

            let renderMesh = this.renderMesh;

            if (!renderMesh.canDrawRect() || texture !== this.currentTexture) {
                this.end();
                this.start();
                this.currentTexture = texture;
            }
            
            renderMesh.drawRectSimple(mat, size, uvRect, color);
        }

        public drawRect9Slice(mat: Matrix2d, size: Vector2, texture: RenderTexture, rect:Rect, uvRect: Rect, innerRect:Rect, innerUvRect: Rect, color: Color): void {

            let renderMesh = this.renderMesh;

            if (!renderMesh.canDrawRect9Slice() || texture !== this.currentTexture) {
                this.end();
                this.start();
                this.currentTexture = texture;
            }
            
            renderMesh.drawRect9Slice(mat, size, rect, uvRect, innerRect, innerUvRect, color);
        }        

        public drawRect(tmpV1: RenderVertex, tmpV2: RenderVertex, tmpV3: RenderVertex, tmpV4: RenderVertex, texture: RenderTexture): void {

            let renderMesh = this.renderMesh;

            if (!renderMesh.canDrawRect() || texture !== this.currentTexture) {
                this.end();
                this.start();
                this.currentTexture = texture;
            }
            
            renderMesh.drawRect(tmpV1, tmpV2, tmpV3, tmpV4);
        }

        public drawMesh(renderMesh:RenderMesh, texture: RenderTexture) {
            if (this.renderMesh.vertexCount > 0) {
                //Flush current mesh first!!
                this.end();
                this.start();
            }

            this.drawMeshInternal(renderMesh, texture);
        }

        public end() {

            this.drawMeshInternal(this.renderMesh, this.currentTexture);
            this.currentTexture = null;
        }

        private drawMeshInternal(renderMesh:RenderMesh, texture: RenderTexture) {

            if (!EngineConfiguration.RENDER_ENABLED)
                return;

            if (renderMesh.vertexCount === 0)
                return;

            let gl = renderer.gl;

            this.renderProgram.useProgram();
            this.renderProgram.setUniform2f("u_resolution", gl.canvas.width, gl.canvas.height);

            texture.useTexture();

            let vertexBuffer = this.renderVertexBuffers[this.currentBufferIndex];
            let indexBuffer = this.renderIndexBuffers[this.currentBufferIndex];

            vertexBuffer.setData(renderMesh.vertexArray, false);
            indexBuffer.setData(renderMesh.indexArray, false);

            this.renderProgram.setVertexAttributePointer("a_position", vertexBuffer, 2, gl.FLOAT, false, RenderMesh.VERTEX_SIZE, 0);
            this.renderProgram.setVertexAttributePointer("a_color", vertexBuffer, 4, gl.UNSIGNED_BYTE, true, RenderMesh.VERTEX_SIZE, 8);
            this.renderProgram.setVertexAttributePointer("a_texcoord", vertexBuffer, 2, gl.UNSIGNED_SHORT, true, RenderMesh.VERTEX_SIZE, 12);

            if (texture.hasAlpha) {
                gl.enable(gl.BLEND);
                gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
            } else {
                gl.disable(gl.BLEND);
            }

            engine.stats.incrmentDrawcalls();
            gl.drawElements(gl.TRIANGLES, renderMesh.indexCount, gl.UNSIGNED_SHORT, 0);
            this.currentBufferIndex = (this.currentBufferIndex + 1) % this.renderVertexBuffers.length;
        }
    }
}