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

        private gl : WebGLRenderingContext;

        private renderProgram : RenderProgram; 
        private renderBuffers : Array<RenderBuffer>; //Use in round-robing fashion to prevent stalls in rendering due to render buffer reuse in same frame
        private currentRenderBufferIndex = 0;

        private currentTexture : RenderTexture;

        private backingArray : ArrayBuffer;
        private triangles : Float32Array;
        private colors : Uint32Array;
        private uvs : Uint16Array;

        private trianglesOffset : number;
        private colorsOffset : number;
        private uvsOffset : number;

        private trianglesCount : number;

        static ELEMENT_SIZE : number = 2 * 4 + 4 * 1 + 2 * 2; //(2 floats [X,Y] + 4 byte [R,G,B,A] + 2 byte (U,V) )
        static MAX_TRIANGLES = 4096;
        static MAX_ELEMENTS: number = RenderCommands.MAX_TRIANGLES * 3; //3 elements per triangle

        public constructor(gl : WebGLRenderingContext) {
            this.gl = gl;
            this.renderProgram = new RenderProgram(gl, RenderCommands.vertexShader, RenderCommands.fragmentShader);

            this.renderBuffers = new Array<RenderBuffer>();
            for (let i = 0; i < 16; i++)
                this.renderBuffers.push(new RenderBuffer(gl));

            this.backingArray = new ArrayBuffer(RenderCommands.MAX_ELEMENTS * RenderCommands.ELEMENT_SIZE);
            this.triangles = new Float32Array(this.backingArray);
            this.colors = new Uint32Array(this.backingArray);
            this.uvs = new Uint16Array(this.backingArray);
        }

        private tmpV1 : Vector2 = Vector2.create();
        private tmpV2 : Vector2 = Vector2.create(); 
        private tmpV3 : Vector2 = Vector2.create(); 
        private tmpV4 : Vector2 = Vector2.create();  

        private tmpUV1 : Vector2 = Vector2.create(); 
        private tmpUV2 : Vector2 = Vector2.create();
        private tmpUV3 : Vector2 = Vector2.create(); 
        private tmpUV4 : Vector2 = Vector2.create();

        public startFrame() {
            
        }

        public endFrame() {
            
        }

        public start() {
            this.trianglesCount = 0;
            this.trianglesOffset = 0;
            this.colorsOffset = 0;
            this.uvsOffset = 0;
        }

        public drawRect(mat: Matrix2d, halfSize : Vector2, texture : RenderTexture, uvTopLeft : Vector2, uvBottomRight : Vector2, color : Color ) : void {

            if (this.trianglesCount + 2 >= RenderCommands.MAX_TRIANGLES || texture !== this.currentTexture) {
                this.end();
                this.start();
                this.currentTexture = texture;
            }

            let tmpV1 = this.tmpV1;
            let tmpV2 = this.tmpV2;
            let tmpV3 = this.tmpV3;
            let tmpV4 = this.tmpV4;

            let tmpUV1 = this.tmpUV1;
            let tmpUV2 = this.tmpUV2;
            let tmpUV3 = this.tmpUV3;
            let tmpUV4 = this.tmpUV4;

            let triangles = this.triangles;
            let trianglesOffset = this.trianglesOffset;

            let colors = this.colors;
            let colorsOffset = this.colorsOffset;

            let uvs = this.uvs;
            let uvsOffset = this.uvsOffset;

            let halfSizeX = halfSize[0];
            let halfSizeY = halfSize[1];

            //Top left
            tmpV1[0] = -halfSizeX;
            tmpV1[1] = -halfSizeY;
            Vector2.transformMat2d(tmpV1, tmpV1, mat);
            tmpUV1[0] = uvTopLeft[0] * 65535;
            tmpUV1[1] = uvTopLeft[1] * 65535;

            //Top right
            tmpV2[0] = halfSizeX;
            tmpV2[1] = -halfSizeY;
            Vector2.transformMat2d(tmpV2, tmpV2, mat);
            tmpUV2[0] = uvBottomRight[0] * 65535;
            tmpUV2[1] = uvTopLeft[1] * 65535;

            //Bottom right
            tmpV3[0] = halfSizeX;
            tmpV3[1] = halfSizeY;
            Vector2.transformMat2d(tmpV3, tmpV3, mat);
            tmpUV3[0] = uvBottomRight[0] * 65535;
            tmpUV3[1] = uvBottomRight[1] * 65535;

            //Bottom left
            tmpV4[0] = -halfSizeX;
            tmpV4[1] = halfSizeY;
            Vector2.transformMat2d(tmpV4, tmpV4, mat);
            tmpUV4[0] = uvTopLeft[0] * 65535;
            tmpUV4[1] = uvBottomRight[1] * 65535;

            let colorNumber = color.rgbaHex;

            //First triangle (1 -> 2 -> 3)
            triangles[trianglesOffset + 0] = tmpV1[0];
            triangles[trianglesOffset + 1] = tmpV1[1];
            colors[colorsOffset + 2] = colorNumber;
            uvs[uvsOffset + 6] = tmpUV1[0];
            uvs[uvsOffset + 7] = tmpUV1[1];

            triangles[trianglesOffset + 4] = tmpV2[0];
            triangles[trianglesOffset + 5] = tmpV2[1];
            colors[colorsOffset + 6] = colorNumber;
            uvs[uvsOffset + 14] = tmpUV2[0];
            uvs[uvsOffset + 15] = tmpUV2[1];

            triangles[trianglesOffset + 8] = tmpV3[0];
            triangles[trianglesOffset + 9] = tmpV3[1];
            colors[colorsOffset + 10] = colorNumber;
            uvs[uvsOffset + 22] = tmpUV3[0];
            uvs[uvsOffset + 23] = tmpUV3[1];

            trianglesOffset += 12;
            colorsOffset += 12;
            uvsOffset += 24;

            //Second triangle (3 -> 4 -> 1)
            triangles[trianglesOffset + 0] = tmpV3[0];
            triangles[trianglesOffset + 1] = tmpV3[1];
            colors[colorsOffset + 2] = colorNumber;
            uvs[uvsOffset + 6] = tmpUV3[0];
            uvs[uvsOffset + 7] = tmpUV3[1];

            triangles[trianglesOffset + 4] = tmpV4[0];
            triangles[trianglesOffset + 5] = tmpV4[1];
            colors[colorsOffset + 6] = colorNumber;
            uvs[uvsOffset + 14] = tmpUV4[0];
            uvs[uvsOffset + 15] = tmpUV4[1];
            
            triangles[trianglesOffset + 8] = tmpV1[0];
            triangles[trianglesOffset + 9] = tmpV1[1];
            colors[colorsOffset + 10] = colorNumber;
            uvs[uvsOffset + 22] = tmpUV1[0];
            uvs[uvsOffset + 23] = tmpUV1[1];

            trianglesOffset += 12;
            colorsOffset += 12;
            uvsOffset += 24;

            this.trianglesOffset = trianglesOffset;
            this.colorsOffset = colorsOffset;
            this.uvsOffset = uvsOffset;
            this.trianglesCount += 2;  
        }

        public end() {
            if (!EngineConfiguration.RENDER_ENABLED)
                return;

            if (this.trianglesCount === 0)
                return;

            let gl = this.gl;

            this.renderProgram.useProgram();
            this.renderProgram.setUniform2f("u_resolution", gl.canvas.width, gl.canvas.height);

            this.currentTexture.useTexture();

            let renderBuffer = this.renderBuffers[this.currentRenderBufferIndex];

            renderBuffer.setData(this.backingArray, false);

            this.renderProgram.setVertexAttributePointer("a_position", renderBuffer, 2, gl.FLOAT, false, RenderCommands.ELEMENT_SIZE, 0);
            this.renderProgram.setVertexAttributePointer("a_color", renderBuffer, 4, gl.UNSIGNED_BYTE, true, RenderCommands.ELEMENT_SIZE, 8);
            this.renderProgram.setVertexAttributePointer("a_texcoord", renderBuffer, 2, gl.UNSIGNED_SHORT, true, RenderCommands.ELEMENT_SIZE, 12);

            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

            gl.drawArrays(this.gl.TRIANGLES, 0, this.trianglesCount * 3);
            this.currentRenderBufferIndex = (this.currentRenderBufferIndex + 1) % this.renderBuffers.length;

            this.currentTexture = null;
        }
    }
}