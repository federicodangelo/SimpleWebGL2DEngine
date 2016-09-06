/// <reference path="../Simple2DEngine/Component/UI/Screen.ts" />

class GameScreen extends s2d.Screen {

    private lastButtonY : number = 100;

    protected onScreenInit() {
        this.addTestButton("Test Simple", TestSimple);
        this.addTestButton("Test Moving Triangles", TestMovingTriangles);
        this.addTestButton("Test Tilemap", TestTilemap);
    }

    protected addTestButton<T extends Test>(name:string, testClazz: { new (): T }) : void {

        let button = s2d.EntityFactory.buildTextButton(name);
        button.entity.transform.setLocalPosition(300, this.lastButtonY).setParent(this.trans);
        button.onClick.attach(() => { 
            GameLogic.instance.setActiveTest(new testClazz());
        });

        this.lastButtonY += 100;
    }
}