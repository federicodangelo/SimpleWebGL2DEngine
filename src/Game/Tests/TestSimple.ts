class TestSimple extends Test {

    private entities: Array<s2d.Entity> = new Array<s2d.Entity>();

    private texture: s2d.RenderTexture;

    private loadCompleted:boolean = false;
    
    protected onInit() {
        s2d.loader.loadRenderTextureFromUrl("test.png", "assets/test.png", false);
        s2d.loader.attachOnLoadCompleteListener(this.onLoadComplete, this);
    }

    private toggleActive() : void {
        this.testContainer.entity.active = !this.testContainer.entity.active;
    }

    private onLoadComplete() {
        this.texture = s2d.loader.getAsset("test.png");
        this.loadCompleted = true;
        this.initTestSimple();
    }

    private initTestSimple() {
        if (!this.loadCompleted)
            return;

        let e1 = s2d.EntityFactory.buildTextureDrawer(this.texture).entity;
        let e2 = s2d.EntityFactory.buildTextureDrawer(this.texture).entity;
        let e3 = s2d.EntityFactory.buildTextureDrawer(this.texture).entity;

        e1.transform.localX = 300;
        e1.transform.localY = 300;

        e2.transform.parent = e1.transform;
        e2.transform.localX = 200;

        e3.transform.parent = e2.transform;
        e3.transform.localX = 100;

        this.entities.push(e1);
        this.entities.push(e2);
        this.entities.push(e3);
    }

    protected onUpdate() {
        var entities = this.entities;
        for (let i = 0; i < entities.length; i++)
            entities[i].transform.localRotationDegrees += 360 * s2d.Time.deltaTime;
    }

    protected onDestroy() {
        for (let i = 0; i < this.entities.length; i++)
            this.entities[i].destroy();
        this.entities.length = 0;
    }
}
