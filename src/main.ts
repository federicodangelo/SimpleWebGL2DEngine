/// <reference path="Simple2DEngine/Engine.ts" />

window.onload = () => {
    new Simple2DEngine.Engine();
    Simple2DEngine.engine.init();

    //Creat main game logic entity
    new Simple2DEngine.Entity("GameLogic").addComponent(GameLogic);

    requestAnimationFrame(update);
};

function update() {
    Simple2DEngine.engine.update();
    requestAnimationFrame(update);
}
