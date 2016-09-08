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

        public static buildButton() : Button {
            var entity = new Entity("Button");
            entity.addComponent(SpriteDrawer);
            var button = entity.addComponent(Button);
            entity.transform.setPivot(-1, -1).setLocalScale(3, 3);
            return button;
        }

        public static buildTextButton(text:string) : Button {

            var entity = new Entity("Button");
            entity.addComponent(SpriteDrawer);
            var button = entity.addComponent(Button);
            entity.transform.setPivot(-1, -1).setLocalScale(3, 3);

            //Layout used to make the button match the size of the text inside
            var layout = entity.addComponent(Layout)
                .setSizeMode(LayoutSizeMode.MatchChildrenBest, LayoutSizeMode.MatchChildrenBest)
                .setSizeOffset(8, 4); //4px on X, 2px on Y

            //Text drawer
            var textDrawer = EntityFactory.buildTextDrawer();
            textDrawer.entity.getOrAddComponent(Layout)
                .setAnchorMode(LayoutAnchorMode.RelativeToParent, LayoutAnchorMode.RelativeToParent);

            textDrawer.color.setFromRgba(0, 0, 0);
            textDrawer.fontScale = 1;

            textDrawer.text = text;
            textDrawer.entity.transform.parent = entity.transform;
            
            return button;
        }

        public static buildFullscreenTextButton(text:string) : FullscreenButton {

            var entity = new Entity("Button");
            entity.addComponent(SpriteDrawer);
            var button = entity.addComponent(FullscreenButton);
            entity.transform.setPivot(-1, -1).setLocalScale(3, 3);

            //Layout used to make the button match the size of the text inside
            entity.addComponent(Layout)
                .setSizeMode(LayoutSizeMode.MatchChildrenBest, LayoutSizeMode.MatchChildrenBest)
                .setSizeOffset(8, 4); //4px on X, 2px on Y

            //Text drawer
            var textDrawer = EntityFactory.buildTextDrawer();
            textDrawer.entity.getOrAddComponent(Layout)
                .setAnchorMode(LayoutAnchorMode.RelativeToParent, LayoutAnchorMode.RelativeToParent);
                
            textDrawer.color.setFromRgba(0, 0, 0);
            textDrawer.fontScale = 1;

            textDrawer.text = text;
            textDrawer.entity.transform.parent = entity.transform;
            
            return button;
        }

        public static buildTilemapDrawer(tilemap:Tilemap) : TilemapDrawer {
            let entity = new Entity("Tilemap");
            let tilemapDrawer = entity.addComponent(TilemapDrawer);
            tilemapDrawer.tilemap = tilemap;
            entity.transform.setPivot(-1, -1);
            entity.addComponent(s2d.Layout).setSizeMode(s2d.LayoutSizeMode.MatchDrawerBest, s2d.LayoutSizeMode.MatchDrawerBest);
            return tilemapDrawer;
        }

        public static buildWithComponent<T extends Component>(clazz: { new (): T }, name: String = "Entity"): T {
            return new Entity(name).addComponent(clazz);
        }
    }
}