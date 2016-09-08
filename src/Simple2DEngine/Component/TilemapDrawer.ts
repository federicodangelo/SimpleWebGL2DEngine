/// <reference path="Drawer.ts" />
/// <reference path="../Assets/Tilemap.ts" />

module s2d {
    export class TilemapDrawer extends Drawer {
        private _tilemap: Tilemap = null;
        private _color: Color = Color.fromRgba(255, 255, 255, 255);
        private _tileSize: Vector2 = Vector2.fromValues(32, 32);
        private _mesh: RenderMesh = null;
        private _dirty: boolean = true;
        private _bestSize: Vector2 = Vector2.create();

        public get tilemap(): Tilemap {
            return this._tilemap;
        }

        public set tilemap(value: Tilemap) {
            this._tilemap = value;
            this._dirty = true;
        }

        public get color(): Color {
            return this._color;
        }

        public set color(value: Color) {
            this._color.copyFrom(value);
            this._dirty = true;
        }

        public get tileSize(): Vector2 {
            return this._tileSize;
        }

        public set tileSize(value: Vector2) {
            Vector2.copy(this._tileSize, value);
            this._dirty = true;
        }

        public getBestSize(): Vector2 {
            if (this.tilemap !== null) {
                this._bestSize[0] = this.tilemap.width * this.tileSize[0];
                this._bestSize[1] = this.tilemap.height * this.tileSize[1];
            }
            return this._bestSize;
        }

        private tmpTileSize: Vector2 = Vector2.create();

        private buildRenderMesh(matrix: Matrix2d) {

            let tilemap = this.tilemap;
            let trans = this.entity.transform;
            let pivot = trans.pivot;

            let color = this._color;
            let width = tilemap.width;
            let height = tilemap.height;
            let data = tilemap.data;

            let tileSize = this.tmpTileSize;
            Vector2.copy(tileSize, this.tileSize);
            tileSize[0] = trans.sizeX / tilemap.width;
            tileSize[1] = trans.sizeY / tilemap.height;

            let right = Vector2.fromValues(tileSize[0], 0);
            let down = Vector2.fromValues(0, tileSize[1]);

            Vector2.transformMat2d(right, right, matrix);
            Vector2.transformMat2d(down, down, matrix);

            let startingPosition = Vector2.fromValues(matrix[4], matrix[5]);

            let mesh = this._mesh;

            if (mesh === null || mesh.maxTriangles !== width * height * 2) {
                mesh = new RenderMesh(width * height * 2);
                this._mesh = mesh;
            } else {
                mesh.reset();
            }

            for (let y = 0; y < height; y++) {

                matrix[4] = startingPosition[0] + down[0] * y;
                matrix[5] = startingPosition[1] + down[1] * y;

                let line = data[y];

                for (let x = 0; x < width; x++) {

                    let tile = line[x];
                    if (tile !== null) {
                        let sprite = tile.sprite;
                        mesh.drawRectSimple(matrix, tileSize, pivot, sprite.uvRect, this._color);
                    }

                    matrix[4] += right[0];
                    matrix[5] += right[1];
                }
            }

            tilemap.dirty = false;
            this._dirty = false;
        }

        private lastDrawnMatrix: Matrix2d = Matrix2d.create();

        public draw(commands: RenderCommands): void {
            let tilemap = this._tilemap;

            if (tilemap !== null) {

                let matrix = Drawer.tmpMatrix;
                this.entity.transform.getLocalToGlobalMatrix(matrix);

                if (this.lastDrawnMatrix === null ||
                    !Matrix2d.equals(matrix, this.lastDrawnMatrix) ||
                    this._mesh === null ||
                    tilemap.dirty ||
                    this._dirty) {

                    Matrix2d.copy(this.lastDrawnMatrix, matrix);
                    this.buildRenderMesh(matrix);
                }

                //We assume that ALL sprites have the same texture..
                let texture = this.tilemap.tiles[0].sprite.texture;
                commands.drawMesh(this._mesh, texture);
            }
        }
    }
}
