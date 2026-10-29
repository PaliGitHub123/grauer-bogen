class Signal<T> {
    constructor(_value: T) {}
    update(_value: T) {}
}

type TagName =
    "div" |
    "span";

type Properties = {
    class?: string,
    text?: string,
    parent?: HTMLElement,
    onClick?: () => void,
    children?: Array<
        string |
        Signal<unknown> |
        HTMLElement
    >,
};

function e(tagName: TagName, props: Properties): HTMLElement {
    const elem = document.createElement(tagName);
    for (
        const [key, value]
        // Ignore the weird type cast, Object.entries sucks.
        of Object.entries(props) as Array<Exclude<
        {
            [k in keyof Properties]: [
            k,
            Exclude<Properties[k], undefined>
        ]
        }[keyof Properties],
        undefined
    >>
        ) {
        switch (key) {
            case "class": {
                elem.classList.add(value);
                break;
            }
            case "text": {
                elem.textContent = value;
                break;
            }
            case "children": {
                // NOTE: PSEUDO CODE
                /*if (child typeof signal) {
                    textNode = child.content;
                    child.onUpdate(textNode.update);
                }*/
                break;
            }
        }
    }
    return elem;
}

type State = {
    openSettings: () => void,
};

function renderNavigation(sharedState: State) {
    const dataPoint = new Signal("foo");
    dataPoint.update("bar");
    e("div", {
        parent: document.body,
        class: "foo",
        onClick: sharedState.openSettings,
        children: [
            dataPoint,
            e("div", {
                text: "foo<asdf>",
            }),
        ],
    });
}

function init() {
    const sharedState: State = {
        openSettings: () => {
            console.log("open settings");
        },
    };
    renderNavigation(sharedState);
}

window.addEventListener("DOMContentLoaded", init);
