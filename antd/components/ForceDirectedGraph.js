const sampleData = {
    nodes: [
        { id: "Alice", group: 1, type: "video", videoId: "dQw4w9WgXcQ" },
        { id: "Bob", group: 2 },
        { id: "Charlie is a long label", group: 1 },
        { id: "David", group: 3 },
        { id: "Eve", group: 2 },
        { id: "Frank", group: 1 },
        { id: "Grace", group: 3 }
    ],
    links: [
        { source: "Alice", target: "Bob", value: 1 },
        { source: "Alice", target: "Charlie is a long label", value: 2 },
        { source: "Bob", target: "David", value: 3 },
        { source: "Charlie is a long label", target: "Eve", value: 1.5 },
        { source: "David", target: "Frank", value: 2.5 },
        { source: "Eve", target: "Grace", value: 1 },
        { source: "Frank", target: "Bob", value: 0.5 },
        { source: "Grace", target: "Alice", value: 2 }
    ]
};

const ForceDirectedGraph = ({ data = sampleData }) => {
    const chartRef = React.useRef(null);

    React.useEffect(() => {
        if (!chartRef.current || !data) return;

        d3.select(chartRef.current).selectAll("*").remove();

        const width = 928;
        const height = 680;

        const color = d3.scaleOrdinal(d3.schemeCategory10);

        const links = data.links.map(d => ({ ...d }));
        const nodes = data.nodes.map(d => ({ ...d }));

        const simulation = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(links).id(d => d.id).distance(80))
            .force("charge", d3.forceManyBody().strength(-1000))
            .force("x", d3.forceX())
            .force("y", d3.forceY());

        const svg = d3.create("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [-width / 2, -height / 2, width, height])
            .attr("style", "max-width: 100%; height: auto;");

        const link = svg.append("g")
            .attr("stroke", "#999")
            .attr("stroke-opacity", 0.6)
            .selectAll("line") // Changed back to "line"
            .data(links)
            .join("line") // Changed back to "line"
            .attr("stroke-width", d => Math.sqrt(d.value));

        const node = svg.append("g")
            .attr("stroke", "#fff")
            .attr("stroke-width", 0.5)
            .selectAll("g")
            .data(nodes)
            .join("g");

        node.each(function(d) {
            const group = d3.select(this);

            if (d.type === "video" && d.videoId) {
                const videoWidth = 120;
                const videoHeight = 90;
                const nodePadding = 10;
                const collisionRadius = Math.max(videoWidth, videoHeight) / 2 + nodePadding;

                group.append("foreignObject")
                    .attr("x", -videoWidth / 2)
                    .attr("y", -videoHeight / 2)
                    .attr("width", videoWidth)
                    .attr("height", videoHeight)
                    .html(`<div style="
                        width: 100%; height: 100%;
                        display: flex; justify-content: center; align-items: center;
                        background-color: lightgray;
                        border-radius: 8px;
                        overflow: hidden;
                    ">
                        <iframe
                            width="${videoWidth - 10}"
                            height="${videoHeight - 10}"
                            src="https://www.youtube.com/embed/${d.videoId}?controls=0&autoplay=0&modestbranding=1"
                            frameborder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowfullscreen
                            style="border-radius: 5px;">
                        </iframe>
                    </div>`);

                d.radius = collisionRadius;
            } else {
                const initialFoWidth = d.id.length * 7 + 20;
                const initialFoHeight = 25;
                const initialCollisionRadius = initialFoWidth / 2 + 5;

                const foreignObject = group.append("foreignObject")
                    .attr("width", initialFoWidth)
                    .attr("height", initialFoHeight)
                    .attr("x", -initialFoWidth / 2)
                    .attr("y", -initialFoHeight / 2)
                    .html(`<div class="node-label-content" style="
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
                    ">${d.id}</div>`);

                setTimeout(() => {
                    const contentDiv = foreignObject.select(".node-label-content").node();
                    if (contentDiv) {
                        const bbox = contentDiv.getBoundingClientRect();
                        const actualWidth = bbox.width;
                        const actualHeight = bbox.height;

                        foreignObject
                            .attr("width", actualWidth)
                            .attr("height", actualHeight)
                            .attr("x", -actualWidth / 2)
                            .attr("y", -actualHeight / 2);

                        const newCollisionRadius = Math.max(actualWidth, actualHeight) / 2 + 5;
                        d.radius = newCollisionRadius;

                        simulation.force("collide").radius(n => n.radius);
                        simulation.alpha(0.1).restart();
                    }
                }, 0);
            }
        });

        node.append("title")
            .text(d => d.id);

        node.call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

        simulation.force("collide", d3.forceCollide().radius(d => d.radius || 25));

        simulation.on("tick", () => {
            link
                .attr("x1", d => d.source.x) // X-coordinate of the source node
                .attr("y1", d => d.source.y) // Y-coordinate of the source node
                .attr("x2", d => d.target.x) // X-coordinate of the target node
                .attr("y2", d => d.target.y); // Y-coordinate of the target node

            node
                .attr("transform", d => `translate(${d.x},${d.y})`);
        });


        function dragstarted(event) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        }

        function dragged(event) {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        }

        function dragended(event) {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
        }

        chartRef.current.append(svg.node());

        return () => simulation.stop();

    }, [data]);

    return (
        <div>
            <h2>D3.js Force-Directed Graph with HTML Nodes and Straight Links</h2>
            <div ref={chartRef}>
            </div>
        </div>
    );
};