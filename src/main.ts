window.onload = () => {
    new Simple2DEngine.Engine();
    Simple2DEngine.engine.init();
    requestAnimationFrame(update);
};

function update() {
    Simple2DEngine.engine.update();
    requestAnimationFrame(update);
}
