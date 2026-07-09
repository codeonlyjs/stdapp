import { Component, css } from "@codeonlyjs/core";

// Main application
export class LayoutBare extends Component
{
    constructor()
    {
        super();
    }

    loadRoute(route)
    {
        this.page = route.page;
        this.invalidate();
    }

    static template = {
        type: "div",
        id: "layoutBare",
        $: {
            type: "embed-slot",
            content: c => c.page,
        },
    };
}

css`
#layoutBare
{
    max-width: 1050px;
    margin: 0 auto;
    padding-top: var(--header-height);
}
`;
