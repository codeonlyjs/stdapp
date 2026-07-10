import { Component, css, html } from "@codeonlyjs/core";
import { Parser, HtmlRenderer } from "commonmark";

import { DocumentPage } from "./DocumentPage.js";

export class MarkdownPage extends DocumentPage
{
    constructor(markdown)
    {
        super();

        let ast = new Parser().parse(markdown);
        this.html = new HtmlRenderer().render(ast);
    }
}

