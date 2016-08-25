module s2d {
    export class EntityFactory {

        public static buildCamera(): Camera {
            return new Entity("Camera").addComponent(Camera);
        }

        public static buildTextureDrawer(texture: RenderTexture): TextureDrawer {
            var textureDrawer = new Entity("Texture").addComponent(TextureDrawer);
            textureDrawer.texture = texture;
            return textureDrawer
        }

        public static buildTextDrawer(font: RenderFont): TextDrawer {
            var textDrawer = new Entity("Text").addComponent(TextDrawer);
            textDrawer.font = font;
            return textDrawer;
        }

        public static buildWithComponent<T extends Component>(clazz: { new (): T }, name: String = "Entity"): T {
            return new Entity(name).addComponent(clazz);
        }
    }
}