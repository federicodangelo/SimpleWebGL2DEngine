module s2d {
    export class Pool<T> {
        private _instances: Array<T> = new Array<T>();
        private _factoryMethod: () => T = null;
        private _clazz: { new (): T } = null;
        private _createdInstancesCount:number = 0;

        public get createdInstancesCount() {
            return this._createdInstancesCount;
        }

        public constructor(clazz: { new (): T }, precreateCount?: number);
        public constructor(factoryMethod: () => T, precreateCount?: number);
        public constructor(classOrFactoryMethod: any, precreateCount: number = 5) {
            if (classOrFactoryMethod instanceof Function)
                this._factoryMethod = classOrFactoryMethod;
            else
                this._clazz = classOrFactoryMethod;

            for (let i = 0; i < precreateCount; i++)
                this._instances.push(this.getNew());
        }

        private getNew() {
            this._createdInstancesCount++;
            if (this._clazz !== null)
                return new this._clazz();
            else
                return this._factoryMethod.call(null);
        }

        public get(): T {
            if (this._instances.length > 0)
                return this._instances.pop();
            return this.getNew();
        }

        public return(instance: T) {
            this._instances.push(instance);
        }
    }
}