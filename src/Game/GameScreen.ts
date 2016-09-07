/// <reference path="../Simple2DEngine/Component/UI/Screen.ts" />

class GameScreen extends s2d.Screen {

    private offestY : number = -100;

    protected onScreenInit() {
        this.addTestButton("Test Simple", TestSimple);
        this.addTestButton("Test Moving Triangles", TestMovingTriangles);
        this.addTestButton("Test Tilemap", TestTilemap);
    }

    protected addTestButton<T extends Test>(name:string, testClazz: { new (): T }) : void {

        let button = s2d.EntityFactory.buildTextButton(name);
        button.entity.transform.setParent(this.trans).setPivot(0, 0);

        button.entity.getOrAddComponent(s2d.Layout)
            .setAnchorMode(s2d.LayoutAnchorMode.RelativeToParent, s2d.LayoutAnchorMode.RelativeToParent)
            .setAnchorModeOffset(0, this.offestY);
            
        button.onClick.attach(() => { 
            GameLogic.instance.setActiveTest(new testClazz());
        });

        this.offestY += 100;
    }
}