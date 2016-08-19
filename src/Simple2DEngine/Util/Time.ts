module s2d {
    export class Time {

        /**
         * Number of seconds since last update()
         */
        static deltaTime : number;

        static initStatic() {
            Time.deltaTime = 0;
        }
    }
}