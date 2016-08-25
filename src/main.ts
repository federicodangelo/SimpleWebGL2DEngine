/// <reference path="Simple2DEngine/Engine.ts" />

window.onload = () => {
    s2d.engine.init();

    //Creat main game logic entity
    s2d.EntityFactory.buildWithComponent(GameLogic, "GameLogic");

    requestAnimationFrame(update);
};

function update() {
    s2d.engine.update();
    requestAnimationFrame(update);
}
