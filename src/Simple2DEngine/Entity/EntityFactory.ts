module s2d {
    export class EntityFactory {

        public static buildCamera() : Camera {
            return new Entity("Camera").addComponent(Camera);
        }

        public static buildDrawer() : Drawer {
            return new Entity("Drawer").addComponent(Drawer);
        }
    }
}