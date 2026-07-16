import { Component, router, $, notify } from "@codeonlyjs/core";
import { app } from "./Application.js";

export class Meta extends Component
{
    constructor()
    {
        super();

        this.listen(router, "didEnter", (from, to) => {
            this.invalidate();
            if (coenv.browser)
                document.title = this.title;
        });

        this.listen(notify, app)
    }

    get title()
    {
        if (router.current?.title)
            return `${router.current.title} - ${app.settings.name}`;
        else
            return app.settings.name;
    }

    get description()
    {
        return app.settings.description;
    }

    get url()
    {
        return router.current?.url.href ?? false;
    }

    #warningLogged = false;
    get image()
    {
        if (app.settings.image)
        {
            if (app.settings.image.indexOf("://") < 0)
            {
                if (!this.#warningLogged)
                {
                    console.log("Site image setting is not fully qualified, ignored and excluded from meta tags")
                    this.#warningLogged = true;
                }
                return null;
            }
            return app.settings.image;
        }
    }

    static template = [

        // Standard
        $.title(c => c.title),
        $.meta.name("description").content(c => c.description).if(c => c.description),

        // Google/Search
        $.meta.itemprop("name").content(c => c.title).if(c => c.title),
        $.meta.itemprop("description").content(c => c.description).if(c => c.description),
        $.meta.itemprop("image").content(c => c.image).if(c => c.image),

        // Facebook
        $.meta.name("og:url").content(c => c.url).if(c => c.url),
        $.meta.name("og:type").content("website"),
        $.meta.name("og:title").content(c => c.title),
        $.meta.name("og:description").content(c => c.description).if(c => c.description),
        $.meta.name("og:image").content(c => c.image).if(c => c.image),

        // Twitter
        $.meta.name("twitter:card").content("summary_large_image"),
        $.meta.name("twitter:title").content(c => c.title),
        $.meta.name("twitter:description").content(c => c.description).if(c => c.description),
        $.meta.name("twitter:image").content(c => c.image).if(c => c.image),

        // Apple
        $.link.rel("apple-touch-icon").href(c => c.image).if(c => c.image),
        
    ]
}
