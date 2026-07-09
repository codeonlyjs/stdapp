import { Component, router } from "@codeonlyjs/core";

export class ErrorPage extends Component
{
    constructor(info)
    {
        super();
        this.info = info;
    }

    static template = {
        type: "div",
        class: "center",
        $: [
            {
                type: "h1",
                class: "danger",
                text: c => `${c.info.title} 😟`,
            },
            {
                type: "p",
                text: c => `${c.info.message}`
            },
            {
                type: "p",
                $: {
                    type: "a",
                    href: () => router.externalize("/"),
                    text: "Return Home",
                }
            }
        ]
    };
}

router.register({
    match: (to) => {
        to.page = new ErrorPage({
            title: "Page not found!",
            message: `The page ${to.url} doesn't exist!`,
        });
        return true;
    },
    order: 1000,
});

