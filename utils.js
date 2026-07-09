export function getScrollParent(element, includeHidden) 
{
    var style = getComputedStyle(element);
    var excludeStaticParent = style.position === "absolute";
    var overflowRegex = includeHidden ? /(auto|scroll|hidden)/ : /(auto|scroll)/;

    if (style.position === "fixed") return document.body;
    for (var parent = element; (parent = parent.parentElement);) {
        style = getComputedStyle(parent);
        if (excludeStaticParent && style.position === "static") {
            continue;
        }
        if (overflowRegex.test(style.overflow + style.overflowY + style.overflowX)) return parent;
    }

    return document.body;
}



export function ensureVisible(elItem, elContainer, options)
{
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

