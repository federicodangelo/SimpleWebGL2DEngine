class TestMovingTriangles extends Test {

    private entities: Array<s2d.Entity> = new Array<s2d.Entity>();

    static TEST_NESTING = true;
    static TEST_MOVING = true;
    static RECTS_COUNT = 1024;

    private texture: s2d.RenderTexture;

    private loadCompleted:boolean = false;

    private lastEntitiesCount: number = 0;
    
    protected onInit() {

        let resetButton = s2d.EntityFactory.buildTextButton("Reset");
        resetButton.entity.transform.setLocalPosition(300, 8).setParent(this.uiContainer);
        resetButton.onClick.attach(this.onResetButtonClicked, this);

        let clearButton = s2d.EntityFactory.buildTextButton("Clear");
        clearButton.entity.transform.setLocalPosition(450, 8).setParent(this.uiContainer);
        clearButton.onClick.attach(this.onClearButtonClicked, this);

        let addMore = s2d.EntityFactory.buildTextButton("Add\nMore");
        addMore.entity.transform.setLocalPosition(450, 60).setParent(this.uiContainer);
        addMore.onClick.attach(this.initTest, this);

        let toggleRotationButton = s2d.EntityFactory.buildTextButton("Toggle\nRotation");
        toggleRotationButton.entity.transform.setLocalPosition(600, 8).setParent(this.uiContainer);
        toggleRotationButton.onClick.attach(() => TestMovingTriangles.TEST_MOVING = !TestMovingTriangles.TEST_MOVING );

        let toggleNestingButton = s2d.EntityFactory.buildTextButton("Toggle\nNesting");
        toggleNestingButton.entity.transform.setLocalPosition(800, 8).setParent(this.uiContainer);
        toggleNestingButton.onClick.attach(() => { TestMovingTriangles.TEST_NESTING = !TestMovingTriangles.TEST_NESTING; this.clear(); this.initTest(); } );

        let toggleActiveButton = s2d.EntityFactory.buildTextButton("Toggle\nActive");
        toggleActiveButton.entity.transform.setLocalPosition(800, 100).setParent(this.uiContainer);
        toggleActiveButton.onClick.attach(this.toggleActive, this);        


        s2d.loader.loadRenderTextureFromUrl("test.png", "assets/test.png", false);
        s2d.loader.attachOnLoadCompleteListener(this.onLoadComplete, this);
        
    }

    private toggleActive() : void {
        this.testContainer.entity.active = !this.testContainer.entity.active;
    }

    private onLoadComplete() {
        this.texture = s2d.loader.getAsset("test.png");
        this.loadCompleted = true;
        this.initTest();
    }

    private onResetButtonClicked(button: s2d.Button) {
        this.clear();
        this.initTest();
    }

    private onClearButtonClicked(button: s2d.Button) {
        this.clear();
    }    

    private clear() {
        for (let i = 0; i < this.entities.length; i++)
            this.entities[i].destroy();
        this.entities.length = 0;
    }    

    private initTest() {
        if (!this.loadCompleted)
            return;

        this.testContainer.entity.active = true;
        
        let sWidth = s2d.engine.renderer.screenWidth;
        let sHeight = s2d.engine.renderer.screenHeight;

        for (let i = 0; i < TestMovingTriangles.RECTS_COUNT; i++) {
            let e = s2d.EntityFactory.buildTextureDrawer(this.texture).entity;

            e.name = "Entity " + i;
            e.transform.localX = s2d.SMath.randomInRangeFloat(100, sWidth - 100);
            e.transform.localY = s2d.SMath.randomInRangeFloat(100, sHeight - 100);

            if (TestMovingTriangles.TEST_NESTING) {
                if (i > 0 && i % 3 == 0)
                    e.transform.parent = this.entities[i - 2].transform;
                else if (i > 0 && i % 5 == 0)
                    e.transform.parent = this.entities[i - 4].transform;
                else if (i > 0 && i % 7 == 0)
                    e.transform.parent = this.entities[i - 6].transform;
                else
                    e.transform.parent = this.testContainer;
            } else {
                e.transform.parent = this.testContainer;
            }

            this.entities.push(e);
        }
    }    

    protected onUpdate() {

        if (TestMovingTriangles.TEST_MOVING) {
            var entities = this.entities;
            for (let i = 0; i < entities.length; i++)
                entities[i].transform.localRotationDegrees += 360 * s2d.Time.deltaTime;
        }

        //if (s2d.input.pointerDown)
        //    this.cam.clearColor.setFromRgba(255, 0, 0); //red
        //else
        //    this.cam.clearColor.setFromRgba(0, 0, 0); //black        
    }
}