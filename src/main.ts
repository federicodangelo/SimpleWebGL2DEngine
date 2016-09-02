/// <reference path="Simple2DEngine/Engine.ts" />

window.onload = () => {
    s2d.engine.init(onInitComplete);
    requestAnimationFrame(update);
}

function onInitComplete() {
    //Creat main game logic entity
    s2d.EntityFactory.buildWithComponent(GameLogic, "GameLogic");
};

function update() {
    s2d.engine.update();
    requestAnimationFrame(update);
}
