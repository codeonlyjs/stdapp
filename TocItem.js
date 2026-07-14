import { Component, css, notify, router } from "@codeonlyjs/core";
import { makeIcon } from "./Icons.js";
import { ensureVisible } from "./utils.js";

export class TocItem extends Component
{
    constructor()
    {
        super();
    }

    #item;
    get item()
    {
        return this.#item;
    }
    set item(value)
    {
        let self = this;
        
        this.unlisten(notify, this.#item, onItemEvent);
        this.#item = value;
        this.invalidate();
        this.listen(notify, this.#item, onItemEvent);

        function onItemEvent(src, action)
        {
            switch (action)
            {
                case "ensureExpanded":
                    self.expanded = true;
                    break;

                case "select":
                    self.selected = true;
                    ensureVisible(self.domTree.rootNode);
                    break;

                case "deselect":
                    self.selected = false;
                    break;   
            }
        }
    }

    #expanded;
    get expanded()
    {
        return this.#expanded;
    }
    set expanded(value)
    {
        this.#expanded = value;
        this.invalidate();
    }

    #selected;
    get selected()
    {
        return this.#selected;
    }
    set selected(value)
    {
        this.#selected = value;
        this.invalidate();
    }

    get url()
    {
        return this.item.url ? router.externalize(this.item.url) : "#";
    }

    toggleExpanded(ev)
    {
        if (!this.#item.children || !this.#item.children.length)
            return;
        this.expanded = !this.expanded;
        ev.preventDefault();
        ev.stopPropagation();
    }

    onClick(ev)
    {
        if (this.#item.url)
            return;
        this.toggleExpanded(ev);
    }

    static template = {
        type: "li",
        class_expanded: c => c.expanded,
        class_selected: c => c.selected,
        $: [
            {
                type: "a",
                href: c => c.url,
                on_click: "onClick",
                $: [
                    {
                        type: "span .arrow",
                        style_visibility: c => c.item.children != null ? "visible" : "hidden",
                        on_click: "toggleExpanded",
                        $: makeIcon("keyboard_arrow_right", 18),
                    },
                    {
                        type: "span",
                        text: c => c.item.title,
                    },
                ]
            },
            {
                if: c => c.item.children,
                type: "ul",
                $: {
                    foreach: c => c.item.children,
                    type: TocItem,
                    item: i => i,
                }
            },
        ]
    }
}

css`
.toc-tree
{
    padding: 0;
    margin: 0;

    a
    {
        display: block;
        color: var(--subtle-color);
        white-space: nowrap;
        border-radius: .2em;
        font-size: 0.8em;
        padding: 0.1em;
        padding-bottom: 0.2em;

        .arrow
        {
            display: inline-block;
            transform: translateY(0.2rem);
        }
    }

    ul
    {
        margin: 0;
        padding-left: 20px;
        display: none;
    }

    li
    {
        list-style-type: none;
    }

    li.expanded > ul
    {
        display: block;
    }

    li.selected > a
    {
        color: var(--accent-color);
        font-weight: bold;
    }

    li > a:hover
    {
        color: var(--accent-color);
        background-color: rgb(from var(--fore-color) r g b / 10%);
    }

    li > a > span.arrow
    {
        transition:.2s transform ease-in-out;
    }

    li.expanded > a > span.arrow
    {
        transform:translateY(0.2rem) rotate(90deg);
    }
}
`;