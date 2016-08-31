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
            textDrawer.fontScale = 3;
            entity.addComponent(Layout).sizeMode = LayoutSizeMode.MatchDrawerBest;
            return textDrawer;
        }

        public static buildButton(texture: RenderTexture) : Button {
            var entity = new Entity("Button");
            var button = entity.addComponent(Button);
            var textureDrawer = entity.addComponent(TextureDrawer);
            textureDrawer.texture = texture;
            entity.transform.pivotX = -1;
            entity.transform.pivotY = -1;
            return button;
        }

        public static buildTextButton(texture: RenderTexture, text:string) : Button {

            var entity = new Entity("Button");
            var button = entity.addComponent(Button);
            var textureDrawer = entity.addComponent(TextureDrawer);
            textureDrawer.texture = texture;
            entity.transform.setPivot(-1, -1);

            //Layout used to make the button match the size of the text inside
            var layout = entity.addComponent(Layout);
            layout.sizeMode = LayoutSizeMode.MatchChildrenBest;
            layout.sizeOffset = Vector2.fromValues(8, 4); //4px on X, 2px on Y

            //Text drawer
            var textDrawer = EntityFactory.buildTextDrawer();
            textDrawer.entity.transform.setPivot(-1, -1).setLocalPosition(4, 2);

            textDrawer.text = text;
            textDrawer.entity.transform.parent = entity.transform;
            
            return button;
        }

        public static buildWithComponent<T extends Component>(clazz: { new (): T }, name: String = "Entity"): T {
            return new Entity(name).addComponent(clazz);
        }
    }
}