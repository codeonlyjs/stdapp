import { Component, css, html } from "@codeonlyjs/core";
import { Parser, HtmlRenderer } from "commonmark";

export class MarkdownPage extends Component
{
    constructor(markdown)
    {
        super();

        let ast = new Parser().parse(markdown);
        this.html = new HtmlRenderer().render(ast);
    }

    static template = {
        type: "div .content-page",
        $: c => html(c.html),
    }
}

css`
.content-page
{
    padding: 1rem 2rem;

    h1:first-child,
    h2:first-child,
    h3:first-child,
    h4:first-child,
    h5:first-child,
    h6:first-child 
    {
        margin-top: 0;
    }
}
`