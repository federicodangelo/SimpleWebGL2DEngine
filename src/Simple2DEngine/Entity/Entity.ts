/// <reference path="../Component/Component.ts" />
/// <reference path="../Component/Transform.ts" />
/// <reference path="../Component/Drawer.ts" />

module s2d {

    export class Entity {

        private _name: String = "Entity";
        private _transform: Transform = null;
        private _destroyed: boolean = false;

        private _firstDrawer: Drawer = null;
        private _firstBehavior: Behavior = null;
        private _firstLayout: Layout = null;

        //First component in the entity
        private _firstComponent: Component = null;

        private static entityConunter: number = 0;

        public get name() {
            return this._name;
        }

        public set name(s: String) {
            this._name = s;
        }

        public get transform() {
            return this._transform;
        }

        public get firstBehavior() {
            return this._firstBehavior;
        }

        public get firstDrawer() {
            return this._firstDrawer;
        }

        public get firstLayout() {
            return this._firstLayout;
        }

        public get destroyed() {
            return this._destroyed;
        }

        constructor(name: String = null) {
            if (name === null)
                name = "Entity " + Entity.entityConunter++;

            this._name = name;
            this._transform = this.addComponent(Transform);
        }

        public addComponent<T extends Component>(clazz: { new (): T }): T {

            if (this._destroyed) {
                EngineConsole.error("Can't add components to a destroyed entity", this);
                return;
            }

            let comp = new clazz();

            let tmp = this._firstComponent;
            this._firstComponent = comp;
            comp.__internal_nextComponent = tmp;

            if (comp instanceof Drawer)
                this._firstDrawer = <any>comp;

            if (comp instanceof Behavior)
                this._firstBehavior = <any>comp;

            if (comp instanceof Layout)
                this._firstLayout = <any>comp;

            comp.init(this);
            return comp;
        }

        public getComponent<T extends Component>(clazz: { new (): T }): T {

            let comp = this._firstComponent;

            while (comp !== null) {
                if (comp instanceof clazz)
                    return comp;
                comp = comp.__internal_nextComponent;
            }

            return null;
        }

        public getComponentInChildren<T extends Component>(clazz: { new (): T }, toReturn: Array<T>): number {
            return this._transform.getComponentInChildren(clazz, toReturn);
        }

        public destroy() {
            entities.destroyEntity(this);
        }

        public __internal_destroy() : void {
            if (!this._destroyed) {
                this._destroyed = true;

                //Destroy components
                var comp = this._firstComponent;
                while (comp !== null) {
                    comp.destroy();
                    comp = comp.__internal_nextComponent;
                }
            }            
        }
    }
}