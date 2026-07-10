import { notify } from "@codeonlyjs/core";

class Application
{
    constructor()
    {
    }

    get name() { return this.#settings.name };
    get description() { return this.#settings.description };
    get image() { return this.#settings.image };
    get logoUrl() { return this.#settings.logoUrl };


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

