/// <reference path="../Simple2DEngine/Component/Behavior.ts" />

class GameStats extends s2d.Behavior {

    private textFPS: s2d.TextDrawer;
    private lastFps: number = 0;
    private lastUpdateTime: number = 0;
    private lastDrawcalls:number = 0;

    public onInit() : void {
        this.textFPS = s2d.EntityFactory.buildTextDrawer();
        
        this.textFPS.entity.transform.setPivot(-1, -1).setLocalPosition(8, 8).setParent(this.entity.transform);
        this.textFPS.color.setFromRgba(0, 255, 0);

        this.entity.addComponent(s2d.Layout).setSizeMode(s2d.LayoutSizeMode.MatchChildrenBest, s2d.LayoutSizeMode.MatchChildrenBest);
        this.entity.transform.setPivot(-1, -1).setParent(s2d.ui.root);
    }

    public update() : void {

        var stats = s2d.engine.stats;

        if (stats.lastFps !== this.lastFps || 
            stats.lastUpdateTime !== this.lastUpdateTime ||
            stats.lastDrawcalls !== this.lastDrawcalls) {

            this.textFPS.text = "fps: " + Math.round(s2d.engine.stats.lastFps) + "\nupdate: " + s2d.engine.stats.lastUpdateTime.toFixed(2) + " ms\nDraw Calls: " + stats.lastDrawcalls;// + "\nEntities: " + this.entities.length;

            this.lastFps = stats.lastFps;
            this.lastUpdateTime = stats.lastUpdateTime;
            this.lastDrawcalls = stats.lastDrawcalls;
            
        }
    }
}
