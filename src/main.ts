/// <reference path="Simple2DEngine/Engine.ts" />

window.onload = () => {
    s2d.engine.init();

    //Creat main game logic entity
    new s2d.Entity("GameLogic").addComponent(GameLogic);

    requestAnimationFrame(update);
};

function update() {
    s2d.engine.update();
    requestAnimationFrame(update);
}
