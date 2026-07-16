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
                class_hasChildren: c => c.item.children != null,
                $: [
                    {
                        if: c => c.item.children != null,
                        type: "span .arrow",
                        on_click: "toggleExpanded",
                        $: makeIcon("keyboard_arrow_right", 18),
                    },
                    c => c.item.title,
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
        color: var(--subtle-fore-color);
        white-space: nowrap;
        border-radius: .2em;
        font-size: 0.8em;
        padding: 0.1em;
        padding-top: 0.2em;
        padding-bottom: 0.2em;
        padding-left: 1.2em;

        .arrow
        {
            display: inline-block;
            transform: translateY(0.2rem);
            width: 1.2em;
        }
    }

    a.has-children
    {
        padding-left: 0;
        padding-top: 0.1em;
    }


    ul
    {
        margin: 0;
        margin-left: 0.5rem;
        padding-left: 0.5rem;
        display: none;
        border-left: 1px solid var(--gridline-color);
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