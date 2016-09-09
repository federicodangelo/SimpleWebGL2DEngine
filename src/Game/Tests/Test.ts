/// <reference path="../../Simple2DEngine/Component/Behavior.ts" />

class Test {

    protected uiContainer: s2d.Transform;
    protected testContainer: s2d.Transform;
    protected exitTest: s2d.Button;
    protected gameLogic: GameLogic;
    
    public init(gameLogic: GameLogic) {
        this.gameLogic = gameLogic;

        this.testContainer = new s2d.Entity("Test Container").transform;
        this.uiContainer = new s2d.Entity("UI Container").transform;
        this.uiContainer.entity.transform.setParent(s2d.ui.root);

        let exitButton = s2d.EntityFactory.buildTextButton("Exit Test");
        exitButton.entity.transform.setLocalPosition(8, 128).setParent(this.uiContainer);
        exitButton.onClick.attach(this.onExitButtonClicked, this);

        this.onInit();
    }

    private onExitButtonClicked() {
        this.gameLogic.setActiveTest(null);
    }

    protected onInit() {

    }

    public update() {
        this.onUpdate();
    }

    protected onUpdate() {

    }

    public destroy() {
        this.onDestroy();
        this.uiContainer.entity.destroy();
        this.testContainer.entity.destroy();
    }

    protected onDestroy() {

    }

    
}