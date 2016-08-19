/// <reference path="../Simple2DEngine/Component/Behavior.ts" />

class GameLogic extends Simple2DEngine.Behavior {

    private cam : Simple2DEngine.Camera;
    private e1 : Simple2DEngine.Entity;

    public onInit() : void {

        this.cam = Simple2DEngine.EntityFactory.buildCamera(); 

        var e1 = Simple2DEngine.EntityFactory.buildDrawer().entity;
        e1.name = "e1";

        e1.transform.localX = 300;
        e1.transform.localY = 300;

        var e2 = Simple2DEngine.EntityFactory.buildDrawer().entity;
        e2.addComponent(Simple2DEngine.Drawer);
        e2.name = "e2";
        
        e2.transform.parent = e1.transform;

        e2.transform.localY = 100;
        e2.transform.localX = 100;

        this.e1 = e1;        
    }

    public update() : void {
        this.e1.transform.localRotationDegrees += 360 * Simple2DEngine.Time.deltaTime; 

        if (Simple2DEngine.engine.input.pointerDown)
            this.cam.clearColor.rgbaHex = 0xFF0000FF; //ref
        else
            this.cam.clearColor.rgbaHex = 0x000000FF; //black
    }
}