/// <reference path="../Simple2DEngine/Component/Behavior.ts" />

class GameLogic extends s2d.Behavior {

    public static instance: GameLogic;

    private cam: s2d.Camera = null;
    private activeTest:Test = null;
    private gameScreen:GameScreen = null;

    public onInit(): void {
        GameLogic.instance = this;

        this.cam = s2d.EntityFactory.buildCamera();

        this.gameScreen = s2d.EntityFactory.buildWithComponent(GameScreen, "Game Screen");
        s2d.EntityFactory.buildWithComponent(GameStats, "Game Stats");
    }

    public update(): void {
        if (this.activeTest !== null)
            this.activeTest.update();
    }

    public setActiveTest(test:Test) {
        if (this.activeTest !== null) {
            this.activeTest.destroy();
            this.activeTest = null;
        }

        this.activeTest = test;

        if (this.activeTest !== null) {
            this.activeTest.init(this);
            this.gameScreen.entity.active = false;
        } else {
            this.gameScreen.entity.active = true;
        }
    }
}
