/// <reference path="../Simple2DEngine/Component/Behavior.ts" />

class GameLogic extends s2d.Behavior {

    private cam : s2d.Camera;
    private entities : Array<s2d.Entity> = new Array<s2d.Entity>();

    static TEST_NESTING = true;
    static TEST_MOVING = true;

    public onInit() : void {

        this.cam = s2d.EntityFactory.buildCamera();

        let sWidth = s2d.engine.renderer.screenWidth;
        let sHeight = s2d.engine.renderer.screenHeight;

        for (let i = 0; i < 8192; i++) {
            let e = s2d.EntityFactory.buildDrawer().entity;

            e.name = "Entity " + i;
            e.transform.localX = s2d.SMath.randomInRangeFloat(100, sWidth - 200);
            e.transform.localY = s2d.SMath.randomInRangeFloat(100, sHeight - 200);

            if (GameLogic.TEST_NESTING) {
                if (i > 0 && i % 3 == 0)
                    e.transform.parent = this.entities[i - 2].transform;

                if (i > 0 && i % 5 == 0)
                    e.transform.parent = this.entities[i - 4].transform;

                if (i > 0 && i % 7 == 0)
                    e.transform.parent = this.entities[i - 6].transform;
            }

            this.entities.push(e);
        }
    }

    public update() : void {

        if (GameLogic.TEST_MOVING) {
            var entities = this.entities;
            for (let i = 0; i < entities.length; i++)
                entities[i].transform.localRotationDegrees += 360 * s2d.Time.deltaTime; 
        }

        if (s2d.input.pointerDown)
            this.cam.clearColor.rgbaHex = 0xFF0000FF; //ref
        else
            this.cam.clearColor.rgbaHex = 0x000000FF; //black
    }
}