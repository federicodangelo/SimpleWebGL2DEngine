/// <reference path="Interactable.ts" />

module s2d {
    export class FullscreenButton extends Button {
        
        private static _activeInstance: FullscreenButton = null;
        public static get activeInstance() {
            return FullscreenButton._activeInstance;
        }

        protected onInit() {
            super.onInit();
            FullscreenButton._activeInstance = this;
        }

        protected onDestroy() {
            if (FullscreenButton._activeInstance === this)
                FullscreenButton._activeInstance = null;

            super.onDestroy();
        }
    }
}