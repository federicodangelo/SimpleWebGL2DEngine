module Simple2DEngine {
    export class RenderCommands {

        private static vertexShader = `
            attribute vec2 a_position;
            attribute vec4 a_color;

            // screen resolution
            uniform vec2 u_resolution;

            // color used in fragment shader
            varying vec4 v_color;

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
            }
        `;

        private static fragmentShader = `
            // fragment shaders don't have a default precision so we need
            // to pick one. mediump is a good default
            precision mediump float;

            //color received from vertex shader
            varying vec4 v_color;

            void main() {
                gl_FragColor = v_color;
            }
        `;

        private gl : WebGLRenderingContext;

        private renderProgram : RenderProgram; 
        private renderBuffer : RenderBuffer;

        private backingArray : ArrayBuffer;
        private triangles : Float32Array;
        private colors : Uint32Array;

        private trianglesOffset : number;
        private colorsOffset : number;

        private trianglesCount : number;

        static ELEMENT_SIZE : number = 2 * 4 + 4 * 1; //(2 floats [X,Y] + 4 byte [R,G,B,A] )

        public constructor(gl : WebGLRenderingContext) {
            this.gl = gl;
            this.renderProgram = new RenderProgram(gl, RenderCommands.vertexShader, RenderCommands.fragmentShader);
            this.renderBuffer = new RenderBuffer(gl);

            this.backingArray = new ArrayBuffer(1024 * 3 * RenderCommands.ELEMENT_SIZE);

            this.triangles = new Float32Array(this.backingArray);
            this.colors = new Uint32Array(this.backingArray);
        }

        private tmpV1 : Vector2 = Vector2.create();
        private tmpV2 : Vector2 = Vector2.create(); 
        private tmpV3 : Vector2 = Vector2.create(); 
        private tmpV4 : Vector2 = Vector2.create();  

        public start() {
            this.trianglesCount = 0;
            this.trianglesOffset = 0;
            this.colorsOffset = 0;
        }

        public drawRect(mat: Matrix3, size : Vector2) : void {

            var tmpV1 = this.tmpV1;
            var tmpV2 = this.tmpV2;
            var tmpV3 = this.tmpV3;
            var tmpV4 = this.tmpV4;
            var triangles = this.triangles;
            var trianglesOffset = this.trianglesOffset;
            var colors = this.colors;
            var colorsOffset = this.colorsOffset;

            var halfSizeX = size[0] * 0.5;
            var halfSizeY = size[1] * 0.5;

            //Top left
            tmpV1[0] = -halfSizeX;
            tmpV1[1] = -halfSizeY;
            Vector2.transformMat3(tmpV1, tmpV1, mat);

            //Top right
            tmpV2[0] = halfSizeX;
            tmpV2[1] = -halfSizeY;
            Vector2.transformMat3(tmpV2, tmpV2, mat);

            //Bottom right
            tmpV3[0] = halfSizeX;
            tmpV3[1] = halfSizeY;
            Vector2.transformMat3(tmpV3, tmpV3, mat);

            //Bottom left
            tmpV4[0] = -halfSizeX;
            tmpV4[1] = halfSizeY;
            Vector2.transformMat3(tmpV4, tmpV4, mat);

            var red = 0xFF0000FF; //ABGR
            var green = 0xFF00FF00; //ABGR
            var blue = 0xFFFF0000; //ABGR

            //First triangle (1 -> 2 -> 3)
            triangles[trianglesOffset + 0] = tmpV1[0];
            triangles[trianglesOffset + 1] = tmpV1[1];
            colors[colorsOffset + 2] = red;

            triangles[trianglesOffset + 3] = tmpV2[0];
            triangles[trianglesOffset + 4] = tmpV2[1];
            colors[colorsOffset + 5] = red;

            triangles[trianglesOffset + 6] = tmpV3[0];
            triangles[trianglesOffset + 7] = tmpV3[1];
            colors[colorsOffset + 8] = red;

            trianglesOffset += 9;
            colorsOffset += 9;

            //Second triangle (3 -> 4 -> 1)
            triangles[trianglesOffset + 0] = tmpV3[0];
            triangles[trianglesOffset + 1] = tmpV3[1];
            colors[colorsOffset + 2] = blue;

            triangles[trianglesOffset + 3] = tmpV4[0];
            triangles[trianglesOffset + 4] = tmpV4[1];
            colors[colorsOffset + 5] = blue;
            
            triangles[trianglesOffset + 6] = tmpV1[0];
            triangles[trianglesOffset + 7] = tmpV1[1];
            colors[colorsOffset + 8] = blue;

            trianglesOffset += 9;
            colorsOffset += 9;

            this.trianglesOffset = trianglesOffset;
            this.colorsOffset = colorsOffset;
            this.trianglesCount += 2;         
        }

        public end() {
            this.renderProgram.useProgram();
            this.renderProgram.setUniform2f("u_resolution", this.gl.canvas.width, this.gl.canvas.height);

            this.renderBuffer.setData(this.backingArray, false);

            this.renderProgram.setVertexAttributePointer("a_position", this.renderBuffer, 2, this.gl.FLOAT, false, RenderCommands.ELEMENT_SIZE, 0);
            this.renderProgram.setVertexAttributePointer("a_color", this.renderBuffer, 4, this.gl.UNSIGNED_BYTE, true, RenderCommands.ELEMENT_SIZE, 8);

            this.gl.drawArrays(this.gl.TRIANGLES, 0, this.trianglesCount * 3);
        }
    }
}