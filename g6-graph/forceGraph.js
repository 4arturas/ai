// forceGraph.js - Functional force-directed graph with enhanced links and pan functionality

// Utility functions
const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);
const clone = obj => JSON.parse(JSON.stringify(obj));
const findNode = (nodes, id) => nodes.find(n => n.id === id);
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Animation circle factory
const createCircle = (id, sourceNode, targetNode, duration, color = "rgb(0,255,0)", startTime = Date.now(), svgElement = null, active = true) => ({
    id,
    sourceNode,
    targetNode,
    duration,
    color,
    startTime,
    svgElement,
    active
});

// Main graph factory function
const createForceGraph = (containerSelector, data, options = {}) => {
    const defaultOptions = {
        nodeRadius: 25,
        linkDistance: 400,
        chargeStrength: -1000,
        xStrength: d => d.x ? 0.5 : 0.1,
        yStrength: d => d.y ? 0.5 : 0.1,
        defaultLinkStyle: {
            stroke: "#999",
            strokeWidth: d => Math.sqrt(d.value || 1),
            strokeDasharray: "none",
            opacity: 0.6
        },
        defaultAnimation: {
            color: "#00ff00",
            duration: 2000,
            radius: 10,
            stroke: "black",
            strokeWidth: 2
        }
    };

    const config = { ...defaultOptions, ...options };
    const container = document.querySelector(containerSelector);
    if (!container) throw new Error('Container not found');

    let state = {
        circles: [],
        nodes: clone(data.nodes),
        links: data.links.map(d => ({
            ...d,
            source: typeof d.source === 'object' ? d.source.id : d.source,
            target: typeof d.target === 'object' ? d.target.id : d.target,
            style: { ...config.defaultLinkStyle, ...(d.style || {}) },
            animate: d.animate ? { ...config.defaultAnimation, ...d.animate } : null
        })),
        nextCircleId: 0,
        simulation: null,
        animationFrame: null,
        lastUpdateTime: Date.now(),
        stationaryMode: false,
        container,
        config,
        svg: null,
        link: null,
        node: null,
        zoom: null // Added for zoom/pan functionality
    };

    // Private functions
    const cleanup = () => {
        if (state.animationFrame) cancelAnimationFrame(state.animationFrame);
        state.circles.forEach(c => c.svgElement?.remove());
        d3.select(state.container).selectAll("*").remove();
        if (state.simulation) state.simulation.stop();
        state = {
            ...state,
            circles: [],
            nextCircleId: 0,
            animationFrame: null,
            simulation: null,
            svg: null,
            link: null,
            node: null,
            zoom: null
        };
    };

    const setupSvg = () => {
        const width = state.container.clientWidth;
        const height = state.container.clientHeight;
        const xExtent = d3.extent(state.nodes, d => d.x || 0);
        const yExtent = d3.extent(state.nodes, d => d.y || 0);
        const PADDING = 100;

        state.svg = d3.create("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [
                (xExtent[0] + xExtent[1]) / 2 - (width / 2),
                (yExtent[0] + yExtent[1]) / 2 - (height / 2),
                width,
                height
            ])
            .attr("style", "max-width: 100%; height: auto;");

        // Add a background rectangle to capture zoom/pan events
        state.svg.append("rect")
            .attr("width", width)
            .attr("height", height)
            .attr("fill", "none")
            .attr("pointer-events", "all");

        // Create a group to hold all graph elements
        state.svg.append("g")
            .attr("class", "graph-container");
    };

    const setupSimulation = () => {
        state.simulation = d3.forceSimulation(state.nodes)
            .force("link", d3.forceLink(state.links).id(d => d.id).distance(config.linkDistance))
            .force("charge", d3.forceManyBody().strength(config.chargeStrength))
            .force("x", d3.forceX().x(d => d.x || 0).strength(config.xStrength))
            .force("y", d3.forceY().y(d => d.y || 0).strength(config.yStrength))
            .force("collide", d3.forceCollide().radius(d => d.radius || config.nodeRadius));

        state.nodes.forEach(node => {
            if (node.x !== undefined && node.y !== undefined) {
                node.fx = node.x;
                node.fy = node.y;
                setTimeout(() => {
                    if (!state.stationaryMode) {
                        node.fx = null;
                        node.fy = null;
                    }
                }, 1000);
            }
        });
    };

    const setupLinks = () => {
        state.link = state.svg.select(".graph-container")
            .append("g")
            .selectAll("line")
            .data(state.links)
            .join("line")
            .attr("stroke", d => d.style.stroke)
            .attr("stroke-width", d => typeof d.style.strokeWidth === 'function'
                ? d.style.strokeWidth(d)
                : d.style.strokeWidth)
            .attr("stroke-dasharray", d => d.style.strokeDasharray)
            .attr("stroke-opacity", d => d.style.opacity);
    };

    const setupNodes = () => {
        state.node = state.svg.select(".graph-container")
            .append("g")
            .attr("stroke", "#fff")
            .attr("stroke-width", 0.5)
            .selectAll("g")
            .data(state.nodes)
            .join("g")
            .on("click", handleNodeClick)
            .call(getDragBehavior());

        state.node.append("circle")
            .attr("r", 10)
            .attr("class", d => `node-circle ${state.stationaryMode ? 'stationary' : ''}`);

        setupNodeLabels();
    };

    const setupNodeLabels = () => {
        state.node.each(function(d) {
            const group = d3.select(this);
            const initialWidth = (d.html ? 100 : d.id.length * 7 + 20);
            const initialHeight = 25;

            const foreignObject = group.append("foreignObject")
                .attr("width", initialWidth)
                .attr("height", initialHeight)
                .attr("x", -initialWidth / 2)
                .attr("y", -initialHeight / 2)
                .html(d.html || `<div class="node-label-content">⚫ ${d.id}</div>`);

            setTimeout(() => {
                const contentDiv = foreignObject.node().firstChild;
                if (contentDiv) {
                    const { width, height } = contentDiv.getBoundingClientRect();
                    foreignObject.attr("width", width)
                        .attr("height", height)
                        .attr("x", -width / 2)
                        .attr("y", -height / 2);

                    d.radius = Math.max(width, height) / 2 + 5;
                    state.simulation.force("collide").radius(d => d.radius);
                    state.simulation.alpha(0.1).restart();
                }
            }, 0);
        });
    };

    const getDragBehavior = () => {
        return d3.drag()
            .on("start", (event) => {
                if (!state.stationaryMode) {
                    if (!event.active) state.simulation.alphaTarget(0.3).restart();
                    event.subject.fx = event.subject.x;
                    event.subject.fy = event.subject.y;
                }
            })
            .on("drag", (event) => {
                if (!state.stationaryMode) {
                    event.subject.fx = event.x;
                    event.subject.fy = event.y;
                }
            })
            .on("end", (event) => {
                if (!state.stationaryMode) {
                    if (!event.active) state.simulation.alphaTarget(0);
                    event.subject.fx = null;
                    event.subject.fy = null;
                }
            });
    };

    const updatePositions = () => {
        state.simulation.on("tick", () => {
            state.link
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            state.node.attr("transform", d => `translate(${d.x},${d.y})`);
        });
    };

    const handleNodeClick = (event, clickedNode) => {
        event.stopPropagation();
        const newCircles = state.links
            .filter(link => (link.source === clickedNode.id || link.target === clickedNode.id) && link.animate?.enabled)
            .map(link => {
                const isSource = link.source === clickedNode.id;
                const targetId = isSource ? link.target : link.source;
                const targetNode = findNode(state.nodes, targetId);

                if (!targetNode) return null;

                const direction = link.animate.direction || "source-to-target";
                let fromNode, toNode;

                if (direction === "target-to-source" || (!isSource && direction !== "both")) {
                    fromNode = targetNode;
                    toNode = clickedNode;
                } else {
                    fromNode = clickedNode;
                    toNode = targetNode;
                }

                return createCircle(
                    state.nextCircleId++,
                    fromNode,
                    toNode,
                    link.animate.duration,
                    link.animate.color
                );
            })
            .filter(Boolean);

        state.circles = [...state.circles, ...newCircles];

        if (!state.animationFrame && newCircles.length > 0) {
            state.animationFrame = requestAnimationFrame(updateAnimation);
        }
    };

    const updateAnimation = () => {
        const now = Date.now();
        state.circles = state.circles.map(circle => {
            const progress = (now - circle.startTime) / circle.duration;

            if (progress >= 1) {
                circle.svgElement?.remove();
                return { ...circle, active: false };
            }

            if (!circle.svgElement) {
                circle.svgElement = state.svg.select(".graph-container").append("circle")
                    .attr("r", state.config.defaultAnimation.radius)
                    .attr("fill", circle.color)
                    .attr("stroke", state.config.defaultAnimation.stroke)
                    .attr("stroke-width", state.config.defaultAnimation.strokeWidth);
            }

            const { sourceNode: source, targetNode: target } = circle;
            if (source && target && source.x && source.y && target.x && target.y) {
                const x = source.x + progress * (target.x - source.x);
                const y = source.y + progress * (target.y - source.y);
                circle.svgElement.attr("cx", x).attr("cy", y);
            }

            return circle;
        }).filter(c => c.active);

        state.lastUpdateTime = now;

        if (state.circles.length > 0) {
            state.animationFrame = requestAnimationFrame(updateAnimation);
        } else {
            state.animationFrame = null;
        }
    };

    const setupZoom = () => {
        state.zoom = d3.zoom()
            .scaleExtent([0.1, 4]) // Allow zooming from 10% to 400%
            .on("zoom", (event) => {
                state.svg.select(".graph-container")
                    .attr("transform", event.transform);
            });

        state.svg.call(state.zoom);
        // Prevent zoom on double-click to avoid interference with node clicks
        state.svg.on("dblclick.zoom", null);
    };

    // Initialize the graph
    cleanup();
    setupSvg();
    setupSimulation();
    setupLinks();
    setupNodes();
    setupZoom(); // Add zoom/pan functionality
    updatePositions();
    state.container.appendChild(state.svg.node());

    // Public API
    const graph = {
        animateLink: (sourceId, targetId, duration = null, color = null) => {
            const sourceNode = findNode(state.nodes, sourceId);
            const targetNode = findNode(state.nodes, targetId);
            const link = state.links.find(l =>
                (l.source === sourceId || l.source.id === sourceId) &&
                (l.target === targetId || l.target.id === targetId)
            );

            if (!sourceNode || !targetNode || !link?.animate?.enabled) {
                console.warn(`Cannot animate link: source=${sourceId}, target=${targetId}, link=${link ? 'found' : 'not found'}`);
                return;
            }

            const actualDuration = duration || link.animate.duration;
            const actualColor = color || link.animate.color;

            const newCircle = createCircle(
                state.nextCircleId++,
                sourceNode,
                targetNode,
                actualDuration,
                actualColor
            );

            state.circles = [...state.circles, newCircle];

            if (!state.animationFrame) {
                state.animationFrame = requestAnimationFrame(updateAnimation);
            }
        },

        animateRandomLink: function () {
            const animatableLinks = state.links.filter(l => l.animate?.enabled);
            if (animatableLinks.length === 0) {
                console.warn('No animatable links found');
                return;
            }

            const randomLink = animatableLinks[randomInt(0, animatableLinks.length - 1)];
            const sourceId = typeof randomLink.source === 'object' ? randomLink.source.id : randomLink.source;
            const targetId = typeof randomLink.target === 'object' ? randomLink.target.id : randomLink.target;

            // Handle direction
            let fromId, toId;
            if (randomLink.animate.direction === "target-to-source") {
                fromId = targetId;
                toId = sourceId;
            } else {
                fromId = sourceId;
                toId = targetId;
            }

            // Call animateLink on the graph object
            this.animateLink(fromId, toId);

            // If direction is "both", animate in reverse too
            if (randomLink.animate.direction === "both") {
                setTimeout(() => {
                    this.animateLink(toId, fromId);
                }, randomLink.animate.duration / 2);
            }
        },

        toggleStationaryMode: () => {
            state.stationaryMode = !state.stationaryMode;

            state.nodes.forEach(node => {
                if (state.stationaryMode) {
                    node.fx = node.x;
                    node.fy = node.y;
                } else {
                    node.fx = null;
                    node.fy = null;
                }
            });

            state.svg.selectAll(".node-circle")
                .classed("stationary", state.stationaryMode);

            state.simulation.alpha(0.3).restart();
        },

        updateData: (newData) => {
            cleanup();
            state.nodes = clone(newData.nodes);
            state.links = newData.links.map(d => ({
                ...d,
                source: typeof d.source === 'object' ? d.source.id : d.source,
                target: typeof d.target === 'object' ? d.target.id : d.target,
                style: { ...config.defaultLinkStyle, ...(d.style || {}) },
                animate: d.animate ? { ...config.defaultAnimation, ...d.animate } : null
            }));
            setupSvg();
            setupSimulation();
            setupLinks();
            setupNodes();
            setupZoom();
            updatePositions();
            state.container.appendChild(state.svg.node());
        },

        destroy: cleanup,
        getState: () => state,
        startAnimationLoop: () => {
            if (!state.animationFrame) {
                state.animationFrame = requestAnimationFrame(updateAnimation);
            }
        }
    };

    return graph;
};

// Export the function
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { createForceGraph };
} else {
    window.forceGraph = { createForceGraph };
}