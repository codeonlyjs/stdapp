import { Component, css, router } from "@codeonlyjs/core";
import { stylish } from "@codeonlyjs/stylish";

// The main header
export class Header extends Component
{
    #title;
    get title()
    {
        return this.#title;
    }

    set title(value)
    {
        this.#title = value;
        this.invalidate();
    }

    #logoUrl;
    get logoUrl()
    {
        return this.#logoUrl;
    }
    set logoUrl(value)
    {
        this.#logoUrl = value;
        this.invalidate();
    }

    #homeUrl
    get homeUrl()
    {
        return this.#homeUrl;
    }
    set homeUrl(value)
    {
        this.#homeUrl = value;
        this.invalidate();
    }

    static template = {
        type: "header #header",
        $: {
            type: "div .container",
            $: [
                {
                    type: "a .title",
                    href: c => router.externalize(c.homeUrl ?? "/"),
                    $: [
                        { 
                            if: c => c.logoUrl,
                            type: "img", 
                            src: c => router.externalize(c.logoUrl),
                        },
                        c => c.title,
                    ]
                },
                {
                    type: "div .buttons",
                    $: [
                        {
                            type: "input type=checkbox .theme-switch",
                            checked: () => stylish.darkMode ? "" : undefined,
                            on_click: () => stylish.toggleTheme(),
                        },
                    ]
                }
            ]
        }
    }
}

css`
:root
{
    --header-height: 50px;
}

#header
{
    position: fixed;
    top: 0;
    width: 100%;
    height: var(--header-height);
    display: flex;
    justify-content: center;
    background-color: var(--body-back-color);
    border-bottom: 1px solid var(--gridline-color);
    z-index: 1;

    .container
    {
        width: 100%;
        max-width: var(--max-site-width);
        height: 100%;
        display: flex;
        justify-content: start;
        align-items: center;
        padding-left: 10px;
        padding-right: 10px;

        .title 
        {
            flex-grow: 1;
            display: flex;
            align-items: center;
            color: var(--body-fore-color);
            transition: opacity 0.2s;

            &:hover
            {
                opacity: 75%;
            }

            img
            {
                height: calc(var(--header-height) - 25px);
                padding-right: 10px
            }
        }


        .buttons
        {
            font-size: 12pt;
            display: flex;
            gap: 10px;
            align-items: center;

            .theme-switch
            {
                transform: translateY(-1.5px);
            }
        }
    }
}
`