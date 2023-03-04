const { createMachine, interpret, assign } = XState;

const dragDropMachine = createMachine({
    initial: 'idle',
    context: {
        // the position of the box
        x: 0,
        y: 0,
        // where you clicked relative to the target element
        dx: 0,
        dy: 0,
        color: 'black'
    },
    states: {
        idle: {
            on: {
                // event: nextstate
                mousedown: {
                    target: 'dragging',
                    actions: assign((context, mouseEvent) => {
                        const boundingRect = mouseEvent.target.getBoundingClientRect()
                        return {
                            ...context,
                            x: boundingRect.x,
                            y: boundingRect.y,
                            dx: mouseEvent.clientX - boundingRect.x,
                            dy: mouseEvent.clientY - boundingRect.y,
                            color: 'green'
                        }
                    })
                }
            }
        },
        dragging: {
            on: {
                mousemove: {
                    target: 'dragging',
                    actions: assign((context, mouseEvent) => {
                        return {
                            ...context,
                            x: mouseEvent.clientX - context.dx,
                            y: mouseEvent.clientY - context.dy,
                            color: 'red'
                        }
                    })
                },
                mouseup: {
                    target: 'idle',
                    actions: [
                        assign((context,mouseEvent) => {
                            return {
                                ...context,
                                color: 'green'
                            }
                        })
                    ]
                }
            }
        }
    }
})