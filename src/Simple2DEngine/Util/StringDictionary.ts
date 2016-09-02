module s2d {
    export class StringDictionary<V> {

        private _data:any = {};
        private _keysCount:number = 0;

        public get data() {
            return this._data;
        }

        public get empty() {
            return this._keysCount === 0;
        }

        public add(key:string, value:V) {
            if (!this.has(key))
                this._keysCount++;
            this._data[key] = value;
        }

        public remove(key:string) {
            if (this.has(key)) {
                this._keysCount--;
                delete this._data[key];
            }
        }

        public has(key:string) {
            return this._data[key] !== undefined;
        }

        public get(key:string) {
            var v:V = this._data[key];
            if (v === undefined)
                v = null;
            return v;
        }
    }
}