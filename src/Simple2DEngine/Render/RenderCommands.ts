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

        private backingVertexArray: ArrayBuffer;
        private positions: Float32Array;
        private colors: Uint32Array;
        private uvs: Uint16Array;

        private backingIndexArray: ArrayBuffer;
        private indexes: Uint16Array;

        private indexesOffset: number;
        private vertexOffset: number;

        static MAX_TRIANGLES = 1024;

        static VERTEX_SIZE: number = 2 * 4 + 4 * 1 + 2 * 2; //(2 floats [X,Y] + 4 byte [A,B,G,R] + 2 byte (U,V) )
        static MAX_VERTEX: number = RenderCommands.MAX_TRIANGLES * 3; //3 vertex per triangle

        static INDEX_SIZE: number = 2; //16 bits
        static MAX_INDEXES: number = RenderCommands.MAX_TRIANGLES * 3; //3 index per triangle

        public constructor() {
            let gl = renderer.gl;
            this.renderProgram = new RenderProgram(RenderCommands.vertexShader, RenderCommands.fragmentShader);

            this.renderVertexBuffers = new Array<RenderBuffer>();
            this.renderIndexBuffers = new Array<RenderBuffer>();
            for (let i = 0; i < RenderCommands.BUFFERS_COUNT; i++) {
                this.renderVertexBuffers.push(new RenderBuffer(gl.ARRAY_BUFFER));
                this.renderIndexBuffers.push(new RenderBuffer(gl.ELEMENT_ARRAY_BUFFER));
            }

            this.backingVertexArray = new ArrayBuffer(RenderCommands.MAX_VERTEX * RenderCommands.VERTEX_SIZE);
            this.positions = new Float32Array(this.backingVertexArray);
            this.colors = new Uint32Array(this.backingVertexArray);
            this.uvs = new Uint16Array(this.backingVertexArray);

            this.backingIndexArray = new ArrayBuffer(RenderCommands.MAX_INDEXES * RenderCommands.INDEX_SIZE);
            this.indexes = new Uint16Array(this.backingIndexArray);
        }

        private tmpV1: RenderVertex = new RenderVertex();
        private tmpV2: RenderVertex = new RenderVertex();
        private tmpV3: RenderVertex = new RenderVertex();
        private tmpV4: RenderVertex = new RenderVertex();

        public startFrame() {

        }

        public endFrame() {

        }

        public start() {
            this.vertexOffset = 0;
            this.indexesOffset = 0;
        }

        public drawRectSimple(mat: Matrix2d, size: Vector2, pivot: Vector2, texture: RenderTexture, uvRect: Rect, color: Color): void {

            let tmpV1 = this.tmpV1;
            let tmpV2 = this.tmpV2;
            let tmpV3 = this.tmpV3;
            let tmpV4 = this.tmpV4;

            let halfSizeX = size[0] * 0.5;
            let halfSizeY = size[1] * 0.5;

            let dx = -pivot[0] * halfSizeX;
            let dy = -pivot[1] * halfSizeY;

            let u0 = uvRect[0];
            let v0 = uvRect[1];
            let u1 = uvRect[0] + uvRect[2];
            let v1 = uvRect[1] + uvRect[3];

            //Top left
            tmpV1.x = -halfSizeX + dx;
            tmpV1.y = -halfSizeY + dy;
            tmpV1.color = color.abgrHex;
            tmpV1.u = u0;
            tmpV1.v = v0;

            //Top right
            tmpV2.x = halfSizeX + dx;
            tmpV2.y = -halfSizeY + dy;
            tmpV2.color = color.abgrHex;
            tmpV2.u = u1;
            tmpV2.v = v0;

            //Bottom right
            tmpV3.x = halfSizeX + dx;
            tmpV3.y = halfSizeY + dy;
            tmpV3.color = color.abgrHex;
            tmpV3.u = u1;
            tmpV3.v = v1;

            //Bottom left
            tmpV4.x = -halfSizeX + dx;
            tmpV4.y = halfSizeY + dy;
            tmpV4.color = color.abgrHex;
            tmpV4.u = u0;
            tmpV4.v = v1;

            tmpV1.transformMat2d(mat);
            tmpV2.transformMat2d(mat);
            tmpV3.transformMat2d(mat);
            tmpV4.transformMat2d(mat);

            this.drawRect(tmpV1, tmpV2, tmpV3, tmpV4, texture);
        }

        public drawRect9Slice(mat: Matrix2d, size: Vector2, pivot: Vector2, texture: RenderTexture, uvRect: Rect, innerUvRect: Rect, color: Color): void {

            let tmpV1 = this.tmpV1;
            let tmpV2 = this.tmpV2;
            let tmpV3 = this.tmpV3;
            let tmpV4 = this.tmpV4;

            let halfSizeX = size[0] * 0.5;
            let halfSizeY = size[1] * 0.5;

            let dx = -pivot[0] * halfSizeX;
            let dy = -pivot[1] * halfSizeY;

            let u0 = uvRect[0];
            let v0 = uvRect[1];
            let u1 = uvRect[0] + uvRect[2];
            let v1 = uvRect[1] + uvRect[3];

            let iu0 = innerUvRect[0];
            let iv0 = innerUvRect[1];
            let iu1 = innerUvRect[0] + innerUvRect[2];
            let iv1 = innerUvRect[1] + innerUvRect[3];

            //Draws a total of 9 rects
            tmpV1.color = tmpV2.color = tmpV3.color = tmpV4.color = color.abgrHex;

            let x0 = -halfSizeX + dx;
            let y0 = -halfSizeY + dy;
            let x1 = halfSizeX + dx;
            let y1 = halfSizeY + dy;

            let leftWidth = iu0 - u0;
            let rightWidth = u1 - iu1;
            let topHeight = iv0 - v0;
            let bottomHeight = v1 - iv1;

            let ix0 = x0 + leftWidth;
            let iy0 = y0 + topHeight;
            let ix1 = x1 - rightWidth;
            let iy1 = y1 - bottomHeight;

            iu0 /= texture.width;
            iv0 /= texture.height;
            iu1 /= texture.width;
            iv1 /= texture.height;

            u0 /= texture.width;
            v0 /= texture.height;
            u1 /= texture.width;
            v1 /= texture.height;

            /**
             * Reference:
             * 
             *  x0,y0                             x1,y0
             *   /----------------------------------\
             *   |                                  |
             *   |  ix0,iy0               ix1,iy0   |
             *   |   /-----------------------\      |
             *   |   |                       |      |
             *   |   |                       |      |
             *   |   |                       |      |
             *   |   \-----------------------/      |
             *   |  ix0,iy1               ix1,iy1   |
             *   |                                  |
             *   \----------------------------------/
             *  x0,y1                             x1,y1
             * 
             *   
             * 
             */

            //TODO: OPTIMIZE!!!
            //This can be done with only 16 vertexes, since all vertexes share uv / colors 

            //Top left corner
            this.drawRect(
                tmpV1.setXYUV(x0, y0, u0, v0).transformMat2d(mat), 
                tmpV2.setXYUV(ix0, y0, iu0, v0).transformMat2d(mat), 
                tmpV3.setXYUV(ix0, iy0, iu0, iv0).transformMat2d(mat), 
                tmpV4.setXYUV(x0, iy0, u0, iv0).transformMat2d(mat), 
                texture);

            //Top middle
            this.drawRect(
                tmpV1.setXYUV(ix0, y0, iu0, v0).transformMat2d(mat), 
                tmpV2.setXYUV(ix1, y0, iu1, v0).transformMat2d(mat),
                tmpV3.setXYUV(ix1, iy0, iu1, iv0).transformMat2d(mat),
                tmpV4.setXYUV(ix0, iy0, iu0, iv0).transformMat2d(mat),
                texture);

            //Top right corner
            this.drawRect(
                tmpV1.setXYUV(ix1, y0, iu1, v0).transformMat2d(mat),
                tmpV2.setXYUV(x1, y0, u1, v0).transformMat2d(mat),
                tmpV3.setXYUV(x1, iy0, u1, iv0).transformMat2d(mat),
                tmpV4.setXYUV(ix1, iy0, iu1, iv0).transformMat2d(mat),
                texture);

            //Center left
            this.drawRect(
                tmpV1.setXYUV(x0, iy0, u0, iv0).transformMat2d(mat), 
                tmpV2.setXYUV(ix0, iy0, iu0, iv0).transformMat2d(mat),
                tmpV3.setXYUV(ix0, iy1, iu0, iv1).transformMat2d(mat),
                tmpV4.setXYUV(x0, iy1, u0, iv1).transformMat2d(mat),
                texture);

            //Center middle
            this.drawRect(
                tmpV1.setXYUV(ix0, iy0, iu0, iv0).transformMat2d(mat),
                tmpV2.setXYUV(ix1, iy0, iu1, iv0).transformMat2d(mat),
                tmpV3.setXYUV(ix1, iy1, iu1, iv1).transformMat2d(mat),
                tmpV4.setXYUV(ix0, iy1, iu0, iv1).transformMat2d(mat),
                texture);

            //Center right
            this.drawRect(
                tmpV1.setXYUV(ix1, iy0, iu1, iv0).transformMat2d(mat),
                tmpV2.setXYUV(x1, iy0, u1, iv0).transformMat2d(mat),
                tmpV3.setXYUV(x1, iy1, u1, iv1).transformMat2d(mat),
                tmpV4.setXYUV(ix1, iy1, iu1, iv1).transformMat2d(mat),
                texture);

            //Bottom left corner
            this.drawRect(
                tmpV1.setXYUV(x0, iy1, u0, iv1).transformMat2d(mat),
                tmpV2.setXYUV(ix0, iy1, iu0, iv1).transformMat2d(mat),
                tmpV3.setXYUV(ix0, y1, iu0, v1).transformMat2d(mat),
                tmpV4.setXYUV(x0, y1, u0, v1).transformMat2d(mat),
                texture);

            //Bottom middle
            this.drawRect(
                tmpV1.setXYUV(ix0, iy1, iu0, iv1).transformMat2d(mat),
                tmpV2.setXYUV(ix1, iy1, iu1, iv1).transformMat2d(mat),
                tmpV3.setXYUV(ix1, y1, iu1, v1).transformMat2d(mat),
                tmpV4.setXYUV(ix0, y1, iu0, v1).transformMat2d(mat),
                texture);

            //Bottom right corner
            this.drawRect(
                tmpV1.setXYUV(ix1, iy1, iu1, iv1).transformMat2d(mat),
                tmpV2.setXYUV(x1, iy1, u1, iv1).transformMat2d(mat),
                tmpV3.setXYUV(x1, y1, u1, v1).transformMat2d(mat),
                tmpV4.setXYUV(ix1, y1, iu1, v1).transformMat2d(mat),
                texture);
        }        

        public drawRect(tmpV1: RenderVertex, tmpV2: RenderVertex, tmpV3: RenderVertex, tmpV4: RenderVertex, texture: RenderTexture): void {

            if (this.vertexOffset + 4 >= RenderCommands.MAX_VERTEX || this.indexesOffset + 6 >= RenderCommands.MAX_INDEXES || texture !== this.currentTexture) {
                this.end();
                this.start();
                this.currentTexture = texture;
            }

            var vertexOffset = this.vertexOffset;
            let indexesOffset = this.indexesOffset;

            let positions = this.positions;
            let colors = this.colors;
            let uvs = this.uvs;
            let indexes = this.indexes;

            let positionsOffset = vertexOffset * 4;
            let colorsOffset = vertexOffset * 4;
            let uvsOffset = vertexOffset * 8;

            //Add 4 vertexes
            positions[positionsOffset + 0] = tmpV1.x;
            positions[positionsOffset + 1] = tmpV1.y;
            colors[colorsOffset + 2] = tmpV1.color;
            uvs[uvsOffset + 6] = tmpV1.u * 65535;
            uvs[uvsOffset + 7] = tmpV1.v * 65535;

            positions[positionsOffset + 4] = tmpV2.x;
            positions[positionsOffset + 5] = tmpV2.y;
            colors[colorsOffset + 6] = tmpV2.color;
            uvs[uvsOffset + 14] = tmpV2.u * 65535;
            uvs[uvsOffset + 15] = tmpV2.v * 65535;

            positions[positionsOffset + 8] = tmpV3.x;
            positions[positionsOffset + 9] = tmpV3.y;
            colors[colorsOffset + 10] = tmpV3.color;
            uvs[uvsOffset + 22] = tmpV3.u * 65535;
            uvs[uvsOffset + 23] = tmpV3.v * 65535;

            positions[positionsOffset + 12] = tmpV4.x;
            positions[positionsOffset + 13] = tmpV4.y;
            colors[colorsOffset + 14] = tmpV4.color;
            uvs[uvsOffset + 30] = tmpV4.u * 65535;
            uvs[uvsOffset + 31] = tmpV4.v * 65535;

            //Add 2 triangles

            //First triangle (0 -> 1 -> 2)
            indexes[indexesOffset + 0] = vertexOffset + 0;
            indexes[indexesOffset + 1] = vertexOffset + 1;
            indexes[indexesOffset + 2] = vertexOffset + 2;

            //Second triangle (2 -> 3 -> 0)
            indexes[indexesOffset + 3] = vertexOffset + 2;
            indexes[indexesOffset + 4] = vertexOffset + 3;
            indexes[indexesOffset + 5] = vertexOffset + 0;
 
            this.vertexOffset += 4;
            this.indexesOffset += 6;
        }

        public end() {
            if (!EngineConfiguration.RENDER_ENABLED)
                return;

            if (this.vertexOffset === 0)
                return;

            let gl = renderer.gl;

            this.renderProgram.useProgram();
            this.renderProgram.setUniform2f("u_resolution", gl.canvas.width, gl.canvas.height);

            this.currentTexture.useTexture();

            let vertexBuffer = this.renderVertexBuffers[this.currentBufferIndex];
            let indexBuffer = this.renderIndexBuffers[this.currentBufferIndex];

            vertexBuffer.setData(this.backingVertexArray, false);
            indexBuffer.setData(this.backingIndexArray, false);

            this.renderProgram.setVertexAttributePointer("a_position", vertexBuffer, 2, gl.FLOAT, false, RenderCommands.VERTEX_SIZE, 0);
            this.renderProgram.setVertexAttributePointer("a_color", vertexBuffer, 4, gl.UNSIGNED_BYTE, true, RenderCommands.VERTEX_SIZE, 8);
            this.renderProgram.setVertexAttributePointer("a_texcoord", vertexBuffer, 2, gl.UNSIGNED_SHORT, true, RenderCommands.VERTEX_SIZE, 12);

            if (this.currentTexture.hasAlpha) {
                gl.enable(gl.BLEND);
                gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
            } else {
                gl.disable(gl.BLEND);
            }

            engine.stats.incrmentDrawcalls();
            gl.drawElements(gl.TRIANGLES, this.indexesOffset, gl.UNSIGNED_SHORT, 0);
            this.currentBufferIndex = (this.currentBufferIndex + 1) % this.renderVertexBuffers.length;

            this.currentTexture = null;
        }
    }
}