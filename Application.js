import { notify } from "@codeonlyjs/core";

class Application
{
    constructor()
    {
    }

    #settings;
    get settings()
    {
        return this.#settings;
    }

    init(value)
    {
        this.#settings = value;
        notify(this, "settingsChanged");
    }
}


export let app = new Application();

