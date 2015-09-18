module BtPo.UI{

    class MainMenuControl {
        static url = "/controls/menu/menu.html";

        openremote() {
            WinJS.Navigation.navigate("/pages/remote/remote.html", { navigateStacked: true });
        }
    }

    export var MainMenu = WinJS.UI.Pages.define(MainMenuControl.url, MainMenuControl);    
}
