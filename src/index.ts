class Signal<T> {
    private listeners: Array<(value: T) => void> = [];

    constructor(private value: T) {} //private value: method called "Parameter Properties", it declares the variable and sets this.value = value in one

    get(): T{
        return this.value;
    }

    update(value: T) {
        this.value = value;
        for(const listener of this.listeners){
            listener(value); //updates all values of all listeners
        }
    }

    onUpdate(listener: (value: T) => void){
        this.listeners.push(listener);
    }
}

type TagName =
    "div" |
    "span"|
    "p";

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
    const counter = new Signal(0);
    e("div", {
        parent: document.body,
        class: "counter",
        children: [
            "Clicks: ",
            e("p", {
                text: "click me",
                onClick: () => counter.update(counter.get() + 1)
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
