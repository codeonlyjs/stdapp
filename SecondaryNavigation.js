import { Component, css, DocumentScrollPosition } from "@codeonlyjs/core";


// The main header
export class SecondaryNavigation extends Component
{
    constructor(toc)
    {
        super();

        this.#toc = toc.filter(x => x.depth <= 3);

        this.listen(coenv.document, "scroll", () => {
            this.positionHighlight();
        });
    }

    #toc;
    #headingCoords = null;
    #oldHeight;
    #highlightId;

    get toc()
    {
        return this.#toc;
    }

    
    hidePopupNav()
    {
        this.dispatchEvent(new Event("hidePopupNav"));
    }

    positionHighlight()
    {
        if (!this.#toc)
            return;

        if (!coenv.browser)
            return;

        let doc = coenv.document;

        // If the document scroll height changed, discard the old
        // heading coords and recalculate
        if (!this.#oldHeight || this.#oldHeight != doc.body.scrollHeight)
        {
            this.#oldHeight = doc.body.scrollHeight;
            this.#headingCoords = null;
        }

        // Calculate heading coords
        let scrollPos = DocumentScrollPosition.get().top;
        if (this.#headingCoords == null)
        {
            this.#headingCoords = this.#toc.map(x => {
                let el = doc.getElementById(x.id);
                if (el)
                {
                    let bounds = el.getBoundingClientRect();
                    return {
                        id: x.id,
                        top: bounds.top + scrollPos,
                    }
                }
            }).filter(x => !!x);
        }

        // Find the first heading that's visible
        let highlightId = "";
        if (scrollPos > 20)
        {
            let vh = window.innerHeight || 0;
            scrollPos += 150;
            for (let hc of this.#headingCoords)
            {
                if (hc.top > scrollPos)
                    break;
                highlightId = hc.id;
            }
        }

        // Quit if correct item already highlighted
        if (highlightId == this.#highlightId)
            return;
        this.#highlightId = highlightId;
        
        // Find the item
        let link = this.domTree.rootNode.querySelector(`a[href='#${highlightId}']`);
        if (link)
        {
            let rThis = this.domTree.rootNode.getBoundingClientRect();
            let r = link.getBoundingClientRect();
            this.highlight.style.top = r.top - rThis.top - 2;
            this.highlight.style.height = r.height + 4;
            link.scrollIntoViewIfNeeded?.(false);
            this.highlight.style.display = "";
        }
        else
        {
            this.highlight.style.display = "none";
        }
    }

    update()
    {
        super.update();
        this.positionHighlight();
    }

    static template = {
        type: "nav",
        id: "secondary-nav",
        on_click: c => c.hidePopupNav(),
        $: [
            {
                type: "div .highlight",
                bind: "highlight",
            },
            {
                type: "div .toc",
                $: {
                    foreach: c => c.toc,
                    type: "a",
                    href: i => `${i.url}`,
                    text: i => i.title,
                    attr_class: i => `link toc${i.depth}`,
                }
            }
        ]
    }
}

css`
#secondary-nav
{
    padding: 1rem;
    background-color: var(--body-back-color);
    font-size: 0.9rem;

    div.highlight
    {
        background-color: var(--accent-color);
        position: absolute;
        width: 2px;
        left: 7px;
        top: 45px;
        height: 31px;
        border-radius:1px;
        transition: top 0.5s cubic-bezier(0,1,.5,1) , height 0.5s cubic-bezier(0,1,.5,1);
        display: none;
    }

    a.link
    {
        display: block;
    }
    
    .toc0 { margin-top: 8px; }
    .toc1 { margin-left: 10px; font-size: 0.8rem}
    .toc2 { margin-left: 20px; font-size: 0.8rem}
    .toc3 { margin-left: 30px; font-size: 0.8rem}
}

`;