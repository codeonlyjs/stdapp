import { Component, css, transition, router } from "@codeonlyjs/core";

// Main application
export class LayoutDocumentation extends Component
{
    constructor()
    {
        super();
        this.create();
        router.addEventListener("mayLeave", () => this.hidePanel());
    }

    loadRoute(route)
    {
        this.page = route.page;
        this.primaryNavigation = route.page.primaryNavigation;
        this.secondaryNavigation = route.page.secondaryNavigation;
        this.invalidate();
    }

    activePanel = null;

    showPanel()
    {
        this.activePanel = "primary";
        this.invalidate();
    }
    showSecondaryPanel()
    {
        this.activePanel = "secondary";
        this.invalidate();
    }
    hidePanel()
    {
        this.activePanel = null;
        this.invalidate();
    }

    static template = {
        type: "div .layout-documentation",
        $: [
            {
                type: "header .mobile-bar",
                $: [
                    {
                        type: "button .subtle .muted .menu-button",
                        on_click: "showPanel",
                        $: [
                            {
                                type: "svg",
                                width: "20",
                                height: "20",
                                viewBox: "0 -960 960 960",
                                preserveAspectRatio: "xMidYMid slice",
                                role: "img",
                                $: {
                                    type: "path",
                                    d: "M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z",
                                }
                            },
                            " Menu"
                        ]
                    },
                    {
                        type: "button .subtle .muted .menu-button",
                        on_click: "showSecondaryPanel",
                        text: "On this page ›"
                    }
                ]
            },
            {
                type: "div.wrapper",
                $: [
                    {
                        type: "div .backdrop",
                        class_active: transition(c => c.activePanel != null),
                        on_click: c => c.hidePanel(),
                    },
                    {
                        type: "div .panel-lhs",
                        class_active: transition(c => c.activePanel == "primary"),
                        $: {
                            type: "embed-slot",
                            content: c => c.primaryNavigation,
                        },
                    },
                    {
                        type: "main .content",
                        $: {
                            type: "embed-slot",
                            content: c => c.page,
                        },
                    },
                    {
                        type: "div .panel-rhs",
                        class_active: transition(c => c.activePanel == "secondary"),
                        $: {
                            type: "embed-slot",
                            content: c => c.secondaryNavigation,
                        },
                    }

                ]
            }
        ]
    };
}

const maxContentWidth = 720;
const sidePanelWidth = 250;

css`
:root
{
    --side-panel-width: ${sidePanelWidth}px;
    --max-content-width: ${maxContentWidth}px;
    --max-site-width: ${maxContentWidth + sidePanelWidth * 2}px;
    --main-indent: calc((100% - (var(--max-content-width) + var(--side-panel-width) * 2)) / 2);
    --fixed-header-height: var(--header-height);
    --align-content: -1.3rem;
}

.layout-documentation
{
    .mobile-bar
    {
        position: fixed;
        width: 100%;
        height: var(--header-height);
        top: var(--header-height);
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid var(--gridline-color);
        padding-left: 10px;
        padding-right: 10px;
        background-color: var(--body-back-color);
        z-index: 1;
        display: none;

        .menu-button
        {
            display: flex;
            align-items: center;
            font-size: 0.9rem;
            padding: 5px;

            svg
            {
                margin-right: 0.2rem;
            }
        }
    }

    .wrapper
    {
        width: 100%;
        height: 100% - var(--header-height);
    }

    .panel-lhs
    {
        position: fixed;
        top: var(--header-height);
        bottom: 0;
        margin-left: var(--main-indent);
        width: var(--side-panel-width);
        background-color: var(--body-back-color);
        z-index: 1;
    }
    .content
    {
        position: relative;
        margin-left: calc(var(--side-panel-width) + var(--main-indent));
        margin-right: calc(var(--side-panel-width) + var(--main-indent));
    }
    .panel-rhs
    {
        position: fixed;
        top: var(--header-height);
        right: 0;
        bottom: 0;
        width: var(--side-panel-width);
        margin-right: var(--main-indent);

        overflow: auto;
        &::-webkit-scrollbar {
            width: 0px;
            background: transparent; /* make scrollbar transparent */
        }

        background-color: var(--body-back-color);
    }


    .backdrop
    {
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        background-color: rgb(from var(--back-color) r g b / 75%);
        display: none;
        z-index: 1;
    }
}

@media screen and (width < ${sidePanelWidth*2 + maxContentWidth + 25}px) 
{
    body
    {
        --main-indent: calc((100% - (var(--max-content-width) + var(--side-panel-width))) / 2);
    }

    .panel-rhs
    {
         display: none;
    }

    .content
    {
        width: var(--max-content-width);
    }
}

@media screen and (width < ${sidePanelWidth + maxContentWidth + 25}px) 
{
    :root
    {
        --fixed-header-height: 0;
        --align-content: 0;
    }
    main
    {
        padding: 10px 40px;
    }
    #header
    {
        position: relative;
        height: var(--header-height);
    }

    .layout-documentation
    {
        .mobile-bar
        {
            position: sticky;
            top: 0;
            display: flex;
        }

        .panel-lhs
        {
            display: none;
        }
        .panel-rhs
        {
        }
        .content
        {
            padding-top: 0;
            width: unset;
            max-width: var(--max-content-width);
            margin: 0 auto;
        }

        .backdrop,
        .panel-lhs,
        .panel-rhs
        {
            transition: opacity 0.25s ease-out, transform 0.25s ease-out;
        }

        .backdrop.active
        {
            display: block;
            opacity: 1;

            &.tx-enter-start,
            &.tx-leave-end
            {
                opacity: 0;
            }
        }   

        .panel-lhs.active
        {
            display: unset;
            margin-left: 0;
            top: 0;
            bottom: 0;
            height: 100%;
            z-index: 100;

            &.tx-enter-start,
            &.tx-leave-end
            {
                transform: translateX(calc(var(--side-panel-width) * -1));
                opacity: 0;
            }
        }

        .panel-rhs.active
        {
            display: flex;
            align-items: stretch;
            top: calc(var(--header-height) * 2 + 1rem);
            left: 15%;
            right: 15%;
            width: 70%;
            height: unset;
            bottom: unset;
            background-color: var(--body-back-color);
            border: 1px solid var(--accent-color);
            border-radius: 0.5rem;
            z-index: 100;
            overflow: hidden;

            nav
            {
                flex-grow: 1;
                position: relative;
                max-height: 50vh;
                overflow: auto;
                padding: 1rem;
            }

            &.tx-enter-start,
            &.tx-leave-end
            {
                transform: translateY(-20px);
                opacity: 0;
            }
        }


        .show-secondary-panel
        {
            &.show-secondary-panel-enter,
            &.show-secondary-panel-leave
            {
                .backdrop,
                .panel-rhs
                {
                    transition: 0.2s ease-out;
                }
            }

            &.show-secondary-panel-start-enter
            {
                .panel-rhs
                {
                    transform: translateY(-20px);
                    opacity: 0;
                }
                .backdrop
                {
                    opacity: 0;
                }
            }

            &.show-secondary-panel-leave
            {
                .panel-rhs
                {
                    transform: translateY(-20px);
                    opacity: 0;
                }
                .backdrop
                {
                    opacity: 0;
                }
            }
        }

        .show-side-panel
        {
            .backdrop
            {
                display: block;
                opacity: 1;
            }

            &.show-side-panel-enter,
            &.show-side-panel-leave
            {
                .backdrop,
                .panel-lhs
                {
                    transition: 0.2s ease-in;
                }
            }

            &.show-side-panel-start-enter
            {
                .panel-lhs
                {
                    transform: translateX(calc(var(--side-panel-width) * -1));
                }
                .backdrop
                {
                    opacity: 0;
                }

            }

            &.show-side-panel-leave
            {
                .panel-lhs
                {
                    transform: translateX(calc(var(--side-panel-width) * -1));
                }
                .backdrop
                {
                    opacity: 0;
                }
            }
        }
    }
}

`
