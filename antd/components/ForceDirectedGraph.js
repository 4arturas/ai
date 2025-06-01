const { Button } = antd;

const sampleData = {
    nodes: [
        { id: "Alice", group: 1 },
        { id: "Bob", group: 2 },
        { id: "Charlie is a long label", group: 1 },
        { id: "David", group: 3 },
        { id: "Eve", group: 2 },
        { id: "Frank", group: 1 },
        { id: "Grace", group: 3 },
        { id: "Test", group: 3 }
    ],
    links: [
        { source: "Alice", target: "Bob", value: 1 },
        { source: "Alice", target: "Charlie is a long label", value: 2 },
        { source: "Bob", target: "David", value: 3 },
        { source: "Charlie is a long label", target: "Eve", value: 1.5 },
        { source: "David", target: "Frank", value: 2.5 },
        { source: "Eve", target: "Grace", value: 1 },
        { source: "Frank", target: "Bob", value: 0.5 },
        { source: "Grace", target: "Alice", value: 2 },
        { source: "Test", target: "Grace", value: 2 },
    ]
};

const nodeLabelHTML = (id) => `
    <div class="node-label-content" style="
        font-size: 10px;
        white-space: nowrap;
        text-align: center;
        color: black;
        background-color: rgba(255, 255, 255, 0.9);
        border: 1px solid #ccc;
        border-radius: 5px;
        padding: 5px 8px;
        line-height: 1.2;
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        pointer-events: none;
    ">⚫ ${id}</div>
`;

const ForceDirectedGraph = ({ data = sampleData }) => {
    const chartRef = React.useRef(null);
    const [circles, setCircles] = React.useState([]);
    const animationRef = React.useRef(null);
    const nodesRef = React.useRef([]);
    const linksRef = React.useRef([]);
    const nextCircleId = React.useRef(0);
    const simulationRef = React.useRef(null);
    const lastUpdateTime = React.useRef(Date.now());

    const createCircle = (sourceNode, targetNode, duration) => ({
        id: nextCircleId.current++,
        sourceNode,
        targetNode,
        duration,
        startTime: Date.now(),
        svgElement: null,
        active: true
    });

    const animateCircle = (sourceId, targetId, duration) => {
        const sourceNode = nodesRef.current.find(n => n.id === sourceId);
        const targetNode = nodesRef.current.find(n => n.id === targetId);

        if (sourceNode && targetNode) {
            setCircles(prev => [...prev, createCircle(sourceNode, targetNode, duration)]);
            if (!animationRef.current) {
                lastUpdateTime.current = Date.now();
                animationRef.current = requestAnimationFrame(updateAnimation);
            }
        }
    };

    const animateRandomCircle = () => {
        const links = linksRef.current;
        if (links.length === 0) return;

        const randomLink = links[Math.floor(Math.random() * links.length)];

        // Handle both string and object references in links
        const sourceId = typeof randomLink.source === 'object' ? randomLink.source.id : randomLink.source;
        const targetId = typeof randomLink.target === 'object' ? randomLink.target.id : randomLink.target;

        const sourceNode = nodesRef.current.find(n => n.id === sourceId);
        const targetNode = nodesRef.current.find(n => n.id === targetId);

        if (sourceNode && targetNode) {
            animateCircle(sourceNode.id, targetNode.id, Math.random() * 2000 + 1000);
        }
    };

    const updateAnimation = () => {
        const now = Date.now();
        const elapsed = now - lastUpdateTime.current;
        lastUpdateTime.current = now;

        setCircles(prevCircles => {
            const updatedCircles = prevCircles.map(circle => {
                const progress = (now - circle.startTime) / circle.duration;

                if (progress >= 1) {
                    circle.svgElement?.remove();
                    return { ...circle, active: false };
                }

                if (!circle.svgElement) {
                    const svg = d3.select(chartRef.current).select("svg");
                    circle.svgElement = svg.append("circle")
                        .attr("r", 10)
                        .attr("fill", "rgb(0,255,0)")
                        .attr("stroke", "black")
                        .attr("stroke-width", 2);
                }

                const source = circle.sourceNode;
                const target = circle.targetNode;
                if (source && target && source.x && source.y && target.x && target.y) {
                    const x = source.x + progress * (target.x - source.x);
                    const y = source.y + progress * (target.y - source.y);
                    circle.svgElement.attr("cx", x).attr("cy", y);
                }

                return circle;
            }).filter(c => c.active);

            if (updatedCircles.length > 0) {
                animationRef.current = requestAnimationFrame(updateAnimation);
            } else {
                animationRef.current = null;
            }

            return updatedCircles;
        });
    };

    React.useEffect(() => {
        if (!chartRef.current) return;

        // Cleanup previous state
        const cleanup = () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
            circles.forEach(c => c.svgElement?.remove());
            d3.select(chartRef.current).selectAll("*").remove();
            if (simulationRef.current) simulationRef.current.stop();
        };
        cleanup();

        const width = chartRef.current.clientWidth;
        const height = chartRef.current.clientHeight;

        // Create copies of the data
        const nodes = data.nodes.map(d => ({ ...d }));
        const links = data.links.map(d => {
            // Normalize link format to always use string references
            return {
                ...d,
                source: typeof d.source === 'object' ? d.source.id : d.source,
                target: typeof d.target === 'object' ? d.target.id : d.target
            };
        });
        nodesRef.current = nodes;
        linksRef.current = links;

        // Create the simulation
        const simulation = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(links).id(d => d.id).distance(80))
            .force("charge", d3.forceManyBody().strength(-1000))
            .force("x", d3.forceX())
            .force("y", d3.forceY())
            .force("collide", d3.forceCollide().radius(d => d.radius || 25));

        simulationRef.current = simulation;

        // Create SVG container
        const svg = d3.create("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [-width / 2, -height / 2, width, height])
            .attr("style", "max-width: 100%; height: auto;");

        // Draw links
        const link = svg.append("g")
            .attr("stroke", "#999")
            .attr("stroke-opacity", 0.6)
            .selectAll("line")
            .data(links)
            .join("line")
            .attr("stroke-width", d => Math.sqrt(d.value));

        // Create node groups
        const node = svg.append("g")
            .attr("stroke", "#fff")
            .attr("stroke-width", 0.5)
            .selectAll("g")
            .data(nodes)
            .join("g")
            .on("click", (event, clickedNode) => {
                event.stopPropagation();
                const newCircles = links
                    .filter(link => link.source === clickedNode.id || link.target === clickedNode.id)
                    .map(link => {
                        const isSource = link.source === clickedNode.id;
                        const targetId = isSource ? link.target : link.source;
                        const targetNode = nodes.find(n => n.id === targetId);
                        return targetNode ? createCircle(clickedNode, targetNode, 1000) : null;
                    })
                    .filter(Boolean);

                setCircles(prev => [...prev, ...newCircles]);
                if (!animationRef.current) {
                    lastUpdateTime.current = Date.now();
                    animationRef.current = requestAnimationFrame(updateAnimation);
                }
            })
            .call(d3.drag()
                .on("start", (event) => {
                    if (!event.active) simulation.alphaTarget(0.3).restart();
                    event.subject.fx = event.subject.x;
                    event.subject.fy = event.subject.y;
                })
                .on("drag", (event) => {
                    event.subject.fx = event.x;
                    event.subject.fy = event.y;
                })
                .on("end", (event) => {
                    if (!event.active) simulation.alphaTarget(0);
                    event.subject.fx = null;
                    event.subject.fy = null;
                }));

        // Add labels to nodes
        node.each(function(d) {
            const group = d3.select(this);
            const initialWidth = d.id.length * 7 + 20;
            const initialHeight = 25;

            const fo = group.append("foreignObject")
                .attr("width", initialWidth)
                .attr("height", initialHeight)
                .attr("x", -initialWidth / 2)
                .attr("y", -initialHeight / 2)
                .html(nodeLabelHTML(d.id));

            // Update node size after DOM rendering
            setTimeout(() => {
                const contentDiv = fo.select(".node-label-content").node();
                if (contentDiv) {
                    const { width, height } = contentDiv.getBoundingClientRect();
                    fo.attr("width", width)
                        .attr("height", height)
                        .attr("x", -width / 2)
                        .attr("y", -height / 2);

                    d.radius = Math.max(width, height) / 2 + 5;
                    simulation.force("collide").radius(d => d.radius);
                    simulation.alpha(0.1).restart();
                }
            }, 0);
        });

        // Update positions on each tick
        simulation.on("tick", () => {
            link.attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            node.attr("transform", d => `translate(${d.x},${d.y})`);
        });

        // Add SVG to DOM
        chartRef.current.appendChild(svg.node());

        return cleanup;
    }, [data]);

    return (
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '10px' }}>
                <Button onClick={() => animateCircle("Test", "Grace", 2000)} style={{ marginRight: '10px' }}>
                    Animate Test→Grace
                </Button>
                <Button onClick={animateRandomCircle}>
                    Animate Random
                </Button>
            </div>
            <div ref={chartRef} style={{ width: "100%", height: "95vh", border: "1px solid gray" }} />
        </div>
    );
};