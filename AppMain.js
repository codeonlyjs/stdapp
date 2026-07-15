import { Component, css, router, notify } from "@codeonlyjs/core";
import { Meta } from "./Meta.js";
import { Header } from "./Header.js";
import { app } from "./Application.js";

import "./ErrorPage.js"

// Main 
export class AppMain extends Component
{
    constructor()
    {
        super();
        
        this.listen(notify, app);
        this.listen(router, "didEnter", (from, to) => this.loadContent(to));
    }

    onMount()
    {
        this.loadContent(router.current);
    }

    loadContent(to)
    {
        // Load navigated page into router slot
        if (to?.page)
        {
            if (!to.page.layout)
            {
                this.layoutSlot.content = to.page;
                this.#currentLayout = null;
            }
            else
            {
                // Different layout?
                if (to.page.layout != this.#currentLayout?.constructor)
                {
                    // Create new layout component
                    this.#currentLayout = new to.page.layout();
                    this.layoutSlot.content = this.#currentLayout;
                }

                this.#currentLayout.loadRoute(to);
            }
        }
    }

    #currentLayout = null;

    static template = {
        type: "div #layoutRoot",
        $: [
            {
                type: Header,
                title: () => app.name,
                logoUrl: () => app.logoUrl,
                homeUrl: () => app.homeUrl,
            },
            {
                type: "embed-slot",
                bind: "layoutSlot",
            }
        ]
    }
}

css`
body
{
    padding: 0;
    margin: 0;
}

#layoutRoot
{
    padding-top: var(--fixed-header-height);
}
`;


export function initApp(settings)
{
    app.init(settings);
    new Meta().mount("head");
    new AppMain().mount("body");
    router.start();
}
