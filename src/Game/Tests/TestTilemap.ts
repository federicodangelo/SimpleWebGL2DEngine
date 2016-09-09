class TestTilemap extends Test {

    private spritesheet: s2d.RenderSpriteAtlas;

    private loadCompleted:boolean = false;
    
    protected onInit() {
        s2d.loader.loadRenderSpriteAtlasFromUrl("spritesheet", "assets/spritesheet.xml");
        s2d.loader.attachOnLoadCompleteListener(this.onLoadComplete, this);
    }

    private toggleActive() : void {
        this.testContainer.entity.active = !this.testContainer.entity.active;
    }

    private onLoadComplete() {
        this.spritesheet = s2d.loader.getAsset("spritesheet");
        this.loadCompleted = true;
        this.initTilemap();
    }

    private tilemapDrawer:s2d.TilemapDrawer = null;

    private initTilemap() {
        if (!this.loadCompleted)
            return;

        let spritesheet = this.spritesheet;

        let tiles = new Array<s2d.Tile>();

        for (let spriteId in spritesheet.sprites.data) {
            let sprite:s2d.RenderSprite = spritesheet.sprites.data[spriteId];
            tiles.push(new s2d.Tile(sprite.id, sprite));
        }

        let tilemap = new s2d.Tilemap(128, 64, tiles);

        let data = tilemap.data;

        for (let x = 0; x < tilemap.width; x++)
            for (let y = 0; y < tilemap.height; y++)
                data[y][x] = tiles[(x + y) % tiles.length];

        this.tilemapDrawer = s2d.EntityFactory.buildTilemapDrawer(tilemap);
        this.tilemapDrawer.entity.transform.parent = this.testContainer;
        this.tilemapDrawer.entity.transform.setLocalPosition(0, 0).setPivot(-1, -1);
    }

    private tileCoords:s2d.Vector2 = s2d.Vector2.create();

    protected onUpdate() {
        if (this.tilemapDrawer !== null && s2d.input.pointerDownNow) {
            this.tileCoords = this.tilemapDrawer.getTileCoordsAtGlobalPosition(s2d.input.pointer.position, this.tileCoords);

            if (this.tileCoords[0] != -1 && this.tileCoords[1] != -1) {
                let tilemap = this.tilemapDrawer.tilemap;
                let x = this.tileCoords[0];
                let y = this.tileCoords[1];

                let existingTile = tilemap.getTile(x, y);
                //new tile is next tile in the array
                let newTile = tilemap.tiles[(tilemap.tiles.indexOf(existingTile) + 1) % tilemap.tiles.length];

                tilemap.setTile(x, y, newTile);
            } 


            //console.info("Tile coordinate under mouse: " + s2d.Vector2.toString(this.tileCoords));
        }
    }

    protected onDestroy() {
    }
}
