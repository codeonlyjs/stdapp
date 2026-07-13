import { Component, css, html } from "@codeonlyjs/core";
import { idForText } from "./utils.js";
import { SecondaryNavigation } from "./SecondaryNavigation.js";


/** Implements a document view with automatic secondary navigation
 *  for headings and automatic insertion of heading hash links
 */
export class DocumentPage extends Component
{
    /** Constructs a new DocumentPage instance
     * @param {string} [html] - optional initial html string
     */
    constructor(html)
    {
        super();
        this.#html = html;
    }

    #toc;
    #html;
    #minTocLevel = 2;
    #maxTocLevel = 3;
    #minHashLinkLevel = 2;
    #maxHashLinkLevel = 6;
    elDocument;

    /** Controls the minimum heading level that will be included in the 
     *  secondary navigation TOC (default 2)
     * @type {number}
     */
    get minTocLevel()
    {
        return this.#minTocLevel;
    }
    
    set minTocLevel(value)
    {
        this.#minTocLevel = value;
        this.#toc = null;
        this.invalidate();
    }

    /** Controls the maximum heading level that will be included in the
     *  secondary navigation TOC (default 3)
     * @type {number}
     */
    get maxTocLevel()
    {
        return this.#maxTocLevel;
    }
    
    set maxTocLevel(value)
    {
        this.#maxTocLevel = value;
        this.#toc = null;
        this.invalidate();
    }

    /** Controls the minimum heading level that automatic hash 
     *  links will be created for (default 2)
     * @type {number}
     */
    get minHashLinkLevel()
    {
        return this.#minHashLinkLevel;
    }
    
    set minHashLinkLevel(value)
    {
        this.#minHashLinkLevel = value;
        this.#toc = null;
        this.invalidate();
    }

    /** Controls the maximum heading level that automatic hash 
     *  links will be created for (default 6)
     * @type {number}
     */
    get maxHashLinkLevel()
    {
        return this.#maxHashLinkLevel;
    }
    
    set maxHashLinkLevel(value)
    {
        this.#maxHashLinkLevel = value;
        this.#toc = null;
        this.invalidate();
    }

    /** The html to be displayed by this document
     * @type {string}
     */
    get html() 
    { 
        return this.#html; 
    }
    set html(value)
    {
        this.#toc = null;
        this.#html = value;
        this.invalidate();
    }

    #secondaryNavigation;

    /** Gets the secondary documentation component
     *  with the TOC of this document loaded
     * @type {string}
     */
    get secondaryNavigation()
    {
        if (this.#secondaryNavigation == null)
        {
            this.#secondaryNavigation = new SecondaryNavigation();
            this.#secondaryNavigation.toc = this.#toc;
        }
        return this.#secondaryNavigation;
    }

    // After HTML has been loaded into the DOM, process it
    // to extract headings, insert hash links and create the TOC
    #processDocumentDom()
    {
        // Already processed?
        if (this.#toc)
            return;

        // Get all headings
        this.#toc = [];
        let headings = this.elDocument.querySelectorAll('h1, h2, h3, h4, h5, h6');
        for (let h of headings)
        {
            // Make sure it has an ID
            if (h.id.length == 0)
            {
                h.id = idForText(h.textContent);
            }

            // Adjust level
            let level = parseInt(h.nodeName.substring(1));

            // Add to TOC
            if (level >= this.#minTocLevel && level <= this.#maxTocLevel)
            {
                this.#toc.push({
                    url: `#${h.id}`,
                    depth: level - this.#minTocLevel,
                    title: h.innerText,
                });
            }

            // Create hash links
            if (level >= this.#minHashLinkLevel && level <= this.#maxHashLinkLevel)
            {
                let elHashLink = coenv.document.createElement("a");
                elHashLink.setAttribute("class", 'hashlink');
                elHashLink.setAttribute("href", `#${h.id}`);
                elHashLink.textContent = '#';
                h.insertBefore(elHashLink, h.firstChild);   
            }
        }

        // Pass to secondary nav
        if (this.#secondaryNavigation)
            this.#secondaryNavigation.toc = this.#toc;
    }

    // Overridden notification when DOM has been updated
    domValid()
    {
        super.domValid();
        this.#processDocumentDom();
    }

    static template = {
        type: "div .document",
        bind: "elDocument",
        $: c => html(c.html),
    }
}

css`
.document
{
    /* Document padding */
    padding: 1rem 2rem;

    /* Remove top margin from first heading on page*/
    h1:first-child,
    h2:first-child,
    h3:first-child,
    h4:first-child,
    h5:first-child,
    h6:first-child 
    {
        margin-top: 0;
    }

    /* Fix so that scroll to anchored heading to accounts 
       for header height (and a bit) */
    h1, h2, h3, h4, h5, h6
    {
        scroll-margin-top: calc(var(--scroll-margin-top) + 1rem);
    }

    a.hashlink
    {
        float: left;
        margin-left: -1.3rem;
        opacity: 0;
        transition: opacity .2s;
    }

    h1:hover,
    h2:hover,
    h3:hover,
    h4:hover,
    h5:hover,
    h6:hover
    {
        a.hashlink
        {
            opacity: 1;
        }
    }

}
`