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

        for (let x = 0; x < tilemap.width; x++) {
            for (let y = 0; y < tilemap.height; y++) {
                data[y][x] = tiles[(x + y) % tiles.length];
            }
        }

        let tilemapDrawer = s2d.EntityFactory.buildWithComponent(s2d.TilemapDrawer);
        tilemapDrawer.tilemap = tilemap;
        tilemapDrawer.entity.addComponent(s2d.Layout).setSizeMode(s2d.LayoutSizeMode.MatchDrawerBest, s2d.LayoutSizeMode.MatchDrawerBest);
        tilemapDrawer.entity.transform.setPivot(-1, -1);
        tilemapDrawer.entity.transform.parent = this.testContainer;

    }

    protected onUpdate() {
    }

    protected onDestroy() {
    }
}
