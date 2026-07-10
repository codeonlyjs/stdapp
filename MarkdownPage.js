import { Component, css, html } from "@codeonlyjs/core";
import { Parser, HtmlRenderer } from "commonmark";
import { DocumentPage } from "./DocumentPage.js";

export class MarkdownPage extends DocumentPage
{
    constructor(markdown)
    {
        super();
        this.markdown = markdown;
    }

    #markdown;
    get markdown()
    {
        return this.#markdown;
    }

    set markdown(value)
    {
        this.#markdown = value;
        let ast = new Parser().parse(this.#markdown);
        this.html = new HtmlRenderer().render(ast);
        this.invalidate();
    }
}

