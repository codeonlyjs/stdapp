export function getScrollParent(element, includeHidden) 
{
    let style = getComputedStyle(element);
    let excludeStaticParent = style.position === "absolute";
    let overflowRegex = includeHidden ? /(auto|scroll|hidden)/ : /(auto|scroll)/;

    if (style.position === "fixed") return document.body;
    for (let parent = element; (parent = parent.parentElement);) {
        style = getComputedStyle(parent);
        if (excludeStaticParent && style.position === "static") {
            continue;
        }
        if (overflowRegex.test(style.overflow + style.overflowY + style.overflowX)) return parent;
    }

    return document.body;
}


export function scrollPositionIntoViewWithPadding(container, elTop, elBottom, padding = 20)
{
    const visibleTop = container.scrollTop;
    const visibleBottom = visibleTop + container.clientHeight;

    if (elTop - padding < visibleTop) {
        // element is above the visible area (or too close to top)
        container.scrollTop = elTop - padding;
    } else if (elBottom + padding > visibleBottom) {
        // element is below the visible area (or too close to bottom)
        container.scrollTop = elBottom + padding - container.clientHeight;
    }
}


export function scrollIntoViewWithPadding(container, el, padding = 20) 
{
    if (!container)
        container = getScrollParent(el);

    const containerRect = container.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();

    // element position relative to container's scrollable content
    const elTop = elRect.top - containerRect.top + container.scrollTop;
    const elBottom = elTop + elRect.height;

    const visibleTop = container.scrollTop;
    const visibleBottom = visibleTop + container.clientHeight;

    if (elTop - padding < visibleTop) {
        // element is above the visible area (or too close to top)
        container.scrollTop = elTop - padding;
    } else if (elBottom + padding > visibleBottom) {
        // element is below the visible area (or too close to bottom)
        container.scrollTop = elBottom + padding - container.clientHeight;
    }
    // else: already fully visible with padding, do nothing
}


export function ensureVisible(elItem, elContainer, options)
{
    if (!coenv.browser)
        return;
    if (!elItem)
        return;
    if (!options)
        options = {};
    if (!elContainer)
        elContainer = getScrollParent(elItem, options.includeHidden ?? true);

    options.margin = options.margin || 0;

    // Ensure visible
    options.rectElem = elItem.getBoundingClientRect();
    options.rectContainer = elContainer.getBoundingClientRect();

    if (options.rectElem.bottom > options.rectContainer.bottom - options.margin) 
        elItem.scrollIntoView({ behavior: "auto", block: "end" });
    if (options.rectElem.top < options.rectContainer.top + options.margin) 
        elItem.scrollIntoView({ behavior: "auto", block: "start" });        

}


export function formatLocalDate(d)
{
    let now = new Date();
    d = new Date(d + (now.getTimezoneOffset() * 60000));
    return d.toLocaleDateString(undefined, { dateStyle: "medium" });
}

export function formatLocalTime(d)
{
    let now = new Date();
    d = new Date(d + (now.getTimezoneOffset() * 60000));
    return d.toLocaleTimeString(undefined, { timeStyle: "short" });
}

// Helper for format byte size string
const units = ["B", "KB", "MB", "GB", "TB", 'PB', 'EB', 'ZB', 'YB']
export function formatBytes(bytes) {
  
    if (bytes == 0) 
        return "0B"
  
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))

    if (i == 0)
        return bytes + units[i]

    const n = bytes / Math.pow(1024, i)
    return n.toFixed(n < 10 ? 1 : 0) + units[i];
}

export function idForText(test)
{
    let outStr = "";
    test = test.toLowerCase();
    for (let i=0; i<test.length; i++)
    {
        let ch = test[i];
        if ((ch>='A' && ch <='Z') 
                || (ch>='a' && ch<='z') 
                || (ch>='0' && ch<='9') 
                || (ch == '-') 
                || ch == '_' 
                || ch == ':' 
                || ch == '.')
        {
            outStr += ch;
        }
        else if (ch==' ')
            outStr += '-'
    }
    return outStr;
}