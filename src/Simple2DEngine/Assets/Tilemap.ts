/// <reference path="Tile.ts" />

module s2d {
    export class Tilemap {
        private _tiles:Array<Tile> = new Array<Tile>();
        private _data:Array<Array<Tile>> = new Array<Array<Tile>>();
        private _width:number = 0;
        private _height:number = 0;
        private _dirty:boolean = true;

        public get data() {
            return this._data;
        }

        public get tiles() {
            return this._tiles;
        }

        public get width() {
            return this._width;
        }

        public get height() {
            return this._height;
        }

        public get dirty() {
            return this._dirty;
        }

        public set dirty(value:boolean) {
            this._dirty = value;
        }

        public constructor(width:number, height:number, tiles:Array<Tile>) {
            this._width = width;
            this._height = height;
            this._tiles = tiles;

            let data = this.data;
            let defaultTile = tiles[0];

            for (let y = 0; y < height; y++) {
                let line = new Array<Tile>();
                for (let x = 0; x < width; x++)
                    line.push(defaultTile);
                data.push(line);
            }
        }
    }
}
