import { Component, css } from "@codeonlyjs/core";

export class NextPreviousNavigation extends Component
{
    constructor()
    {
        super();
    }


    get next()
    {
        return "/next";
    }

    get previous()
    {
        return "/prev";
    }

    static template = {
        type: "nav .next-previous-navigation",
        $: [
            this.link("previous", "‹ Previous"),
            this.link("next", "Next ›"),
        ]
    }

    static link(prop, title)
    {
        return [
            {
                if: c => !!c[prop],
                type: "a",
                class: prop,
                href: c => c[prop].url,
                $: [
                    {
                        type: "div .description .muted",
                        text: title,
                    },
                    {
                        type: "div .title",
                        text: c => c[prop].fullTitle,
                    },
                ]
            },
            {
                else: true,
                type: "div",
            }
        ];
    }
}

css`
.next-previous-navigation
{
    border-top: 1px solid var(--gridline-color);
    padding-top: 15px;
    display: flex;
    margin: 0 30px 80px 30px;
    justify-content: space-between;
    a
    {
        font-size: 0.9rem;
    }
    .next
    {
        text-align:right;
    }
    .description
    {
        font-size: 0.8rem;
        color: rgb(from var(--body-fore-color) r g b / 75%);
    }
}
`;