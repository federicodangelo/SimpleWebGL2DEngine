/// <reference path="../Simple2DEngine/Component/Behavior.ts" />

class GameLogic extends s2d.Behavior {

    private cam: s2d.Camera;
    private entities: Array<s2d.Entity> = new Array<s2d.Entity>();

    static TEST_NESTING = true;
    static TEST_MOVING = true;
    static RECTS_COUNT = 1024;

    private texture: s2d.RenderTexture;

    private uiContainer: s2d.Transform;
    private textFPS: s2d.TextDrawer;
    private lastFps: number = 0;
    private lastUpdateTime: number = 0;
    private lastEntitiesCount: number = 0;
    private lastDrawcalls:number = 0;

    private loadCompleted:boolean = false;
    private rectsContainer: s2d.Transform;

    public onInit(): void {
        this.cam = s2d.EntityFactory.buildCamera();

        this.rectsContainer = new s2d.Entity("Rects Container").transform;

        this.uiContainer = new s2d.Entity("UI Container").transform;

        this.textFPS = s2d.EntityFactory.buildTextDrawer();
        this.textFPS.entity.transform.setPivot(-1, -1).setLocalPosition(8, 8).setParent(this.uiContainer);
        this.textFPS.color.setFromRgba(0, 255, 0);

        let resetButton = s2d.EntityFactory.buildTextButton(this.texture, "Reset");
        resetButton.entity.transform.setLocalPosition(300, 8).setParent(this.uiContainer);
        resetButton.onClick.attach(this.onResetButtonClicked, this);

        let clearButton = s2d.EntityFactory.buildTextButton(this.texture, "Clear");
        clearButton.entity.transform.setLocalPosition(450, 8).setParent(this.uiContainer);
        clearButton.onClick.attach(this.onClearButtonClicked, this);

        let addMore = s2d.EntityFactory.buildTextButton(this.texture, "Add\nMore");
        addMore.entity.transform.setLocalPosition(450, 60).setParent(this.uiContainer);
        addMore.onClick.attach(this.initTest, this);

        let toggleRotationButton = s2d.EntityFactory.buildTextButton(this.texture, "Toggle\nRotation");
        toggleRotationButton.entity.transform.setLocalPosition(600, 8).setParent(this.uiContainer);
        toggleRotationButton.onClick.attach(() => GameLogic.TEST_MOVING = !GameLogic.TEST_MOVING );

        let toggleNestingButton = s2d.EntityFactory.buildTextButton(this.texture, "Toggle\nNesting");
        toggleNestingButton.entity.transform.setLocalPosition(800, 8).setParent(this.uiContainer);
        toggleNestingButton.onClick.attach(() => { GameLogic.TEST_NESTING = !GameLogic.TEST_NESTING; this.clear(); this.initTest(); } );

        let toggleActiveButton = s2d.EntityFactory.buildTextButton(this.texture, "Toggle\nActive");
        toggleActiveButton.entity.transform.setLocalPosition(800, 100).setParent(this.uiContainer);
        toggleActiveButton.onClick.attach(this.toggleActive, this);

        s2d.loader.loadRenderTextureFromUrl("test.png", "assets/test.png", false);
        s2d.loader.onLoadComplete.attachOnlyOnce(this.onLoadComplete, this);
    }

    private toggleActive() : void {
        this.rectsContainer.entity.active = !this.rectsContainer.entity.active;
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

    private initTest() {
        this.initTestComplex();
        //this.initTestSimple();

        this.uiContainer.moveToBottom();
    }

    private clear() {
        for (let i = 0; i < this.entities.length; i++)
            this.entities[i].destroy();
        this.entities.length = 0;
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

    private initTestComplex() {
        if (!this.loadCompleted)
            return;

        this.rectsContainer.entity.active = true;
        
        let sWidth = s2d.engine.renderer.screenWidth;
        let sHeight = s2d.engine.renderer.screenHeight;

        for (let i = 0; i < GameLogic.RECTS_COUNT; i++) {
            let e = s2d.EntityFactory.buildTextureDrawer(this.texture).entity;

            e.name = "Entity " + i;
            e.transform.localX = s2d.SMath.randomInRangeFloat(100, sWidth - 100);
            e.transform.localY = s2d.SMath.randomInRangeFloat(100, sHeight - 100);

            if (GameLogic.TEST_NESTING) {
                if (i > 0 && i % 3 == 0)
                    e.transform.parent = this.entities[i - 2].transform;
                else if (i > 0 && i % 5 == 0)
                    e.transform.parent = this.entities[i - 4].transform;
                else if (i > 0 && i % 7 == 0)
                    e.transform.parent = this.entities[i - 6].transform;
                else
                    e.transform.parent = this.rectsContainer;
            }

            this.entities.push(e);
        }
    }

    public update(): void {

        if (GameLogic.TEST_MOVING) {
            var entities = this.entities;
            for (let i = 0; i < entities.length; i++)
                entities[i].transform.localRotationDegrees += 360 * s2d.Time.deltaTime;
        }

        //if (s2d.input.pointerDown)
        //    this.cam.clearColor.setFromRgba(255, 0, 0); //red
        //else
        //    this.cam.clearColor.setFromRgba(0, 0, 0); //black

        var stats = s2d.engine.stats;

        if (stats.lastFps !== this.lastFps || 
            stats.lastUpdateTime !== this.lastUpdateTime ||
            stats.lastDrawcalls !== this.lastDrawcalls || 
            this.entities.length !== this.lastEntitiesCount) {

            this.textFPS.text = "fps: " + Math.round(s2d.engine.stats.lastFps) + "\nupdate: " + s2d.engine.stats.lastUpdateTime.toFixed(2) + " ms\nDraw Calls: " + stats.lastDrawcalls + "\nEntities: " + this.entities.length;

            this.lastFps = stats.lastFps;
            this.lastUpdateTime = stats.lastUpdateTime;
            this.lastDrawcalls = stats.lastDrawcalls;
            this.lastEntitiesCount = this.entities.length;
        }
    }
}