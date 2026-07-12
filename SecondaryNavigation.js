import { Component, css, DocumentScrollPosition } from "@codeonlyjs/core";


// The main header
export class SecondaryNavigation extends Component
{
    constructor(toc)
    {
        super();

        this.toc = toc;

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
    set toc(value)
    {
        if (!value)
            value = [];

        this.#toc = value.filter(x => x.depth <= 3);
        this.update();
    }

    domValid()
    {
        this.positionHighlight();
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
                if (x.url.startsWith("#"))
                {
                    let id = x.url.substring(1);
                    let el = doc.getElementById(id);
                    if (el)
                    {
                        let bounds = el.getBoundingClientRect();
                        return {
                            id: id,
                            top: bounds.top + scrollPos,
                        }
                    }
                }
            }).filter(x => !!x);
        }

        // Find the first heading that's visible
        let highlightId = "";
        if (scrollPos >= 0)
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
            this.highlight.style.top = r.top - rThis.top - 1;
            this.highlight.style.height = r.height + 2;
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
                type: "h2 .title .muted",
                text: "On This Page",
                if: c => c.toc.length > 0,
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
    }

    a.link
    {
        display: block;
    }
    
    h2.title
    {
        font-size: 0.8rem;
        text-transform: uppercase;
        margin-top: 0.5rem;
        margin-bottom: 0.5rem;
    }

    .toc0 { margin-top: 0px; font-size: 0.9rem }
    .toc1 { margin-left: 8px; font-size: 0.8rem }
    .toc2 { margin-left: 16px; font-size: 0.8rem }
    .toc3 { margin-left: 24px; font-size: 0.8rem }
    .toc4 { margin-left: 32px; font-size: 0.8rem }
    .toc5 { margin-left: 40px; font-size: 0.8rem }
}

`;