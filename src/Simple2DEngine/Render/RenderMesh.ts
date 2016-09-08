/// <reference path="RenderBuffer.ts" />
/// <reference path="RenderProgram.ts" />
/// <reference path="RenderVertex.ts" />

module s2d {
    export class RenderMesh {

        private backingVertexArray: ArrayBuffer = null;
        private positions: Float32Array = null;
        private colors: Uint32Array = null;
        private uvs: Uint16Array = null;

        private backingIndexArray: ArrayBuffer = null;
        private indexes: Uint16Array = null;

        private indexesOffset: number = 0;
        private vertexOffset: number = 0;

        private maxVertex: number = 0;
        private maxIndex:number = 0;

        private _maxTriangles:number = 0;
        
        public get vertexCount() {
            return this.vertexOffset;
        }

        public get indexCount() {
            return this.indexesOffset;
        }

        public get vertexArray() {
            return this.backingVertexArray;
        }

        public get indexArray() {
            return this.backingIndexArray;
        }

        public get maxTriangles() {
            return this._maxTriangles;
        }

        static VERTEX_SIZE: number = 2 * 4 + 4 * 1 + 2 * 2; //(2 floats [X,Y] + 4 byte [A,B,G,R] + 2 byte (U,V) )
        static INDEX_SIZE: number = 2; //16 bits

        public constructor(maxTriangles:number = 1024) {
            this._maxTriangles = maxTriangles;
            this.maxVertex = maxTriangles * 3;
            this.maxIndex = maxTriangles * 3;

            this.backingVertexArray = new ArrayBuffer(this.maxVertex * RenderMesh.VERTEX_SIZE);
            this.positions = new Float32Array(this.backingVertexArray);
            this.colors = new Uint32Array(this.backingVertexArray);
            this.uvs = new Uint16Array(this.backingVertexArray);

            this.backingIndexArray = new ArrayBuffer(this.maxIndex * RenderMesh.INDEX_SIZE);
            this.indexes = new Uint16Array(this.backingIndexArray);
        }

        private static tmpV1: RenderVertex = new RenderVertex();
        private static tmpV2: RenderVertex = new RenderVertex();
        private static tmpV3: RenderVertex = new RenderVertex();
        private static tmpV4: RenderVertex = new RenderVertex();

        public reset() {
            this.vertexOffset = 0;
            this.indexesOffset = 0;
        }

        public canDrawRectSimple() : boolean {
            return this.vertexOffset + 4 <= this.maxVertex && this.indexesOffset + 6 <= this.maxIndex;
        }

        public drawRectSimple(mat: Matrix2d, size: Vector2, pivot: Vector2, uvRect: Rect, color: Color): void {

            let tmpV1 = RenderMesh.tmpV1;
            let tmpV2 = RenderMesh.tmpV2;
            let tmpV3 = RenderMesh.tmpV3;
            let tmpV4 = RenderMesh.tmpV4;

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

            this.drawRect(tmpV1, tmpV2, tmpV3, tmpV4);
        }

        public canDrawRect9Slice() : boolean {
            //Draws 9 rects
            return this.vertexOffset + 4 * 9 <= this.maxVertex && this.indexesOffset + 6 * 9 <= this.maxIndex;
        }

        public drawRect9Slice(mat: Matrix2d, size: Vector2, pivot: Vector2, rect:Rect, uvRect: Rect, innerRect:Rect, innerUvRect: Rect, color: Color): void {

            let tmpV1 = RenderMesh.tmpV1;
            let tmpV2 = RenderMesh.tmpV2;
            let tmpV3 = RenderMesh.tmpV3;
            let tmpV4 = RenderMesh.tmpV4;

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

            let leftWidth = innerRect[0] - rect[0];
            let rightWidth = rect[0] + rect[2] - (innerRect[0] + innerRect[2]);
            let topHeight = innerRect[1] - rect[1];
            let bottomHeight = rect[1] + rect[3] - (innerRect[1] + innerRect[3]);

            let ix0 = x0 + leftWidth;
            let iy0 = y0 + topHeight;
            let ix1 = x1 - rightWidth;
            let iy1 = y1 - bottomHeight;

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
                tmpV4.setXYUV(x0, iy0, u0, iv0).transformMat2d(mat));

            //Top middle
            this.drawRect(
                tmpV1.setXYUV(ix0, y0, iu0, v0).transformMat2d(mat), 
                tmpV2.setXYUV(ix1, y0, iu1, v0).transformMat2d(mat),
                tmpV3.setXYUV(ix1, iy0, iu1, iv0).transformMat2d(mat),
                tmpV4.setXYUV(ix0, iy0, iu0, iv0).transformMat2d(mat));

            //Top right corner
            this.drawRect(
                tmpV1.setXYUV(ix1, y0, iu1, v0).transformMat2d(mat),
                tmpV2.setXYUV(x1, y0, u1, v0).transformMat2d(mat),
                tmpV3.setXYUV(x1, iy0, u1, iv0).transformMat2d(mat),
                tmpV4.setXYUV(ix1, iy0, iu1, iv0).transformMat2d(mat));

            //Center left
            this.drawRect(
                tmpV1.setXYUV(x0, iy0, u0, iv0).transformMat2d(mat), 
                tmpV2.setXYUV(ix0, iy0, iu0, iv0).transformMat2d(mat),
                tmpV3.setXYUV(ix0, iy1, iu0, iv1).transformMat2d(mat),
                tmpV4.setXYUV(x0, iy1, u0, iv1).transformMat2d(mat));

            //Center middle
            this.drawRect(
                tmpV1.setXYUV(ix0, iy0, iu0, iv0).transformMat2d(mat),
                tmpV2.setXYUV(ix1, iy0, iu1, iv0).transformMat2d(mat),
                tmpV3.setXYUV(ix1, iy1, iu1, iv1).transformMat2d(mat),
                tmpV4.setXYUV(ix0, iy1, iu0, iv1).transformMat2d(mat));

            //Center right
            this.drawRect(
                tmpV1.setXYUV(ix1, iy0, iu1, iv0).transformMat2d(mat),
                tmpV2.setXYUV(x1, iy0, u1, iv0).transformMat2d(mat),
                tmpV3.setXYUV(x1, iy1, u1, iv1).transformMat2d(mat),
                tmpV4.setXYUV(ix1, iy1, iu1, iv1).transformMat2d(mat));

            //Bottom left corner
            this.drawRect(
                tmpV1.setXYUV(x0, iy1, u0, iv1).transformMat2d(mat),
                tmpV2.setXYUV(ix0, iy1, iu0, iv1).transformMat2d(mat),
                tmpV3.setXYUV(ix0, y1, iu0, v1).transformMat2d(mat),
                tmpV4.setXYUV(x0, y1, u0, v1).transformMat2d(mat));

            //Bottom middle
            this.drawRect(
                tmpV1.setXYUV(ix0, iy1, iu0, iv1).transformMat2d(mat),
                tmpV2.setXYUV(ix1, iy1, iu1, iv1).transformMat2d(mat),
                tmpV3.setXYUV(ix1, y1, iu1, v1).transformMat2d(mat),
                tmpV4.setXYUV(ix0, y1, iu0, v1).transformMat2d(mat));

            //Bottom right corner
            this.drawRect(
                tmpV1.setXYUV(ix1, iy1, iu1, iv1).transformMat2d(mat),
                tmpV2.setXYUV(x1, iy1, u1, iv1).transformMat2d(mat),
                tmpV3.setXYUV(x1, y1, u1, v1).transformMat2d(mat),
                tmpV4.setXYUV(ix1, y1, iu1, v1).transformMat2d(mat));
        }        

        public canDrawRect() : boolean {
            return this.vertexOffset + 4 <= this.maxVertex && this.indexesOffset + 6 <= this.maxIndex;
        }

        public drawRect(tmpV1: RenderVertex, tmpV2: RenderVertex, tmpV3: RenderVertex, tmpV4: RenderVertex): void {

            if (this.vertexOffset + 4 > this.maxVertex || this.indexesOffset + 6 > this.maxIndex) {
                EngineConsole.error("Mesh is full!!!");
                return;
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
   }
}
