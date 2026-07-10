import { Component, css, nextFrame, notify, router } from "@codeonlyjs/core";
import { TocItem } from "./TocItem.js";

function buildUrlMap(toc)
{
    let map = new Map();
    if (toc)
        updateMap(toc);
    return map;

    function updateMap(item)
    {
        if (item.url)
            map.set(item.url, item);
        if (item.children)
        {
            for (let c of item.children)
            {
                updateMap(c);
                c.parent = item;
            }
        }
    }
}

export class TocPanel extends Component
{
    constructor(toc)
    {
        super();

        // On navigate, make sure we're on the correct item view
        this.listen(router, "didEnter", (from, to) => {
            if (to.url)
            {
                nextFrame(() => this.selectUrl(to.url));
            }
        });

        this.#toc = toc;
        this.#urlMap = buildUrlMap(this.#toc);
    }

    #toc;
    #urlMap;
    #selectedItem = null;

    get toc()
    {
        return this.#toc;
    }

    set toc(value)
    {
        this.#toc = value;
        this.#urlMap = buildUrlMap(this.#toc);
        this.invalidate();
        nextFrame(() => this.selectUrl(router.current?.url));
    }

    get items()
    {
        if (!this.#toc)
            return [];
        return this.#toc.children;
    }

    selectUrl(url)
    {   
        // Get the TOC item for the url
        let item = this.#urlMap.get(url?.pathname);

        // Redundant?
        if (this.#selectedItem == item)
            return;

        // switch the active folder
        notify(this.#selectedItem, "deselect");
        this.#selectedItem = item;
        notify(this.#selectedItem, "select");

        let p = item.parent;
        while (p)
        {
            notify(p, "ensureExpanded");
            p = p.parent;
        }
    }

    static template = {
        type: "div .toc-panel",
        $: [
            {
                foreach: c => c.items,
                $: [
                    {
                        type: "h2",
                        text: i => i.title,
                    },
                    {
                        type: "ul .toc-tree",
                        $: {
                            foreach: i => i.children,
                            type: TocItem,
                            item: i => i,
                        }
                    }
                ]
            }
        ]
    }
}

css`
.toc-panel
{
    width: 100%;
    height: 100%;
    overflow-y: auto;
    padding-bottom: 30px;
    border-right: 1px solid var(--gridline-color);
    padding-top: 1rem;

    h2
    {
        margin: 0;
        margin-top: 1rem;
        font-size: 0.8rem;
    }

    h2:first-child
    {
        margin-top: 0.5rem;
    }


    &::-webkit-scrollbar { width: 5px; }
    &::-webkit-scrollbar-track { background: transparent; }
    &::-webkit-scrollbar-thumb { background: var(--gridline-color); border-radius: 3px; }
}
`;