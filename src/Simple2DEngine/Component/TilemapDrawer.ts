/// <reference path="Drawer.ts" />
/// <reference path="../Assets/Tilemap.ts" />

module s2d {
    export class TilemapDrawer extends Drawer {
        private _tilemap: Tilemap = null;
        private _color: Color = Color.fromRgba(255, 255, 255, 255);
        private _tileSize: Vector2 = Vector2.fromValues(32, 32);

        public get tilemap(): Tilemap {
            return this._tilemap;
        }

        public set tilemap(value: Tilemap) {
            this._tilemap = value;
        }

        public get color(): Color {
            return this._color;
        }

        public set color(value: Color) {
            this._color.copyFrom(value);
        }

        public get tileSize(): Vector2 {
            return this._tileSize;
        }

        public set tileSize(value: Vector2) {
            Vector2.copy(this._tileSize, value);
        }

        public draw(commands: RenderCommands): void {
            let tilemap = this._tilemap;

            if (tilemap !== null) {

                let trans = this.entity.transform;
                let pivot = trans.pivot;
                let matrix = Drawer.tmpMatrix;
                trans.getLocalToGlobalMatrix(matrix);

                let color = this._color;
                let width = tilemap.width;
                let height = tilemap.height;
                let data = tilemap.data;

                let tileSize = this.tileSize;

                let right = Vector2.fromValues(tileSize[0], 0);
                let down = Vector2.fromValues(0, tileSize[1]);

                Vector2.transformMat2d(right, right, matrix);
                Vector2.transformMat2d(down, down, matrix);

                let startingPosition = Vector2.fromValues(matrix[4], matrix[5]);

                for (let y = 0; y < height; y++) {
                    
                    matrix[4] = startingPosition[0] + down[0] * y;
                    matrix[5] = startingPosition[1] + down[1] * y;

                    let line = data[y];

                    for (let x = 0; x < width; x++) {
                        
                        let tile = line[x];
                        if (tile !== null) {
                            let sprite = tile.sprite;
                            commands.drawRectSimple(matrix, tileSize, pivot, sprite.texture, sprite.uvRect, this._color);
                        }

                        matrix[4] += right[0];
                        matrix[5] += right[1];
                    }
                }
            }
        }
    }
}
