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

        public static buildTextDrawer(): TextDrawer {
            var entity = new Entity("Text");
            var textDrawer = entity.addComponent(TextDrawer);
            entity.addComponent(Layout).sizeMode = LayoutSizeMode.MatchDrawerBest;
            return textDrawer;
        }

        public static buildWithComponent<T extends Component>(clazz: { new (): T }, name: String = "Entity"): T {
            return new Entity(name).addComponent(clazz);
        }
    }
}