/// <reference path="../Simple2DEngine/Component/Behavior.ts" />

class GameLogic extends Simple2DEngine.Behavior {

    private cam : Simple2DEngine.Camera;
    private entities : Array<Simple2DEngine.Entity> = new Array<Simple2DEngine.Entity>();

    public onInit() : void {

        this.cam = Simple2DEngine.EntityFactory.buildCamera();

        let sWidth = Simple2DEngine.engine.renderer.screenWidth;
        let sHeight = Simple2DEngine.engine.renderer.screenHeight;

        for (let i = 0; i < 8192; i++) {
            let e = Simple2DEngine.EntityFactory.buildDrawer().entity;

            e.name = "Entity " + i;
            e.transform.localX = Simple2DEngine.SMath.randomInRangeFloat(100, sWidth - 200);
            e.transform.localY = Simple2DEngine.SMath.randomInRangeFloat(100, sHeight - 200);

            if (i > 0 && i % 3 == 0)
                e.transform.parent = this.entities[i - 2].transform;

            if (i > 0 && i % 5 == 0)
                e.transform.parent = this.entities[i - 4].transform;

            if (i > 0 && i % 7 == 0)
                e.transform.parent = this.entities[i - 6].transform;

            this.entities.push(e);
        }
    }

    public update() : void {
        for (let i = 0; i < this.entities.length; i++)
            this.entities[i].transform.localRotationDegrees += 360 * Simple2DEngine.Time.deltaTime; 

        if (Simple2DEngine.engine.input.pointerDown)
            this.cam.clearColor.rgbaHex = 0xFF0000FF; //ref
        else
            this.cam.clearColor.rgbaHex = 0x000000FF; //black
    }
}