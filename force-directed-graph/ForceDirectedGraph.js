const ForceDirectedGraph = ({ initialNodes, initialLinks, backgroundType }) => {
    const svgRef = useRef();
    const [nodes, setNodes] = useState(initialNodes);
    const [links, setLinks] = useState(initialLinks);
    const gRef = useRef();

    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const tableColumns = [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Age', dataIndex: 'age', key: 'age' },
        { title: 'City', dataIndex: 'city', key: 'city' },
    ];

    const tableData = [
        { key: '1', name: 'John Doe', age: 32, city: 'New York' },
        { key: '2', name: 'Jane Smith', age: 28, city: 'London' },
        { key: '3', name: 'Sam Green', age: 45, city: 'Paris' },
        { key: '4', name: 'Alice Brown', age: 35, city: 'Berlin' },
        { key: '5', name: 'Bob White', age: 40, city: 'Tokyo' },
    ];

    const getRectIntersection = (rectX, rectY, rectWidth, rectHeight, p1x, p1y, p2x, p2y) => {
        const dx = p2x - p1x;
        const dy = p2y - p1y;

        const intersections = [];

        if (dx !== 0) {
            let t_left = (rectX - p1x) / dx;
            if (t_left >= 0 && t_left <= 1) {
                let y_intersect = p1y + t_left * dy;
                if (y_intersect >= rectY && y_intersect <= rectY + rectHeight) {
                    intersections.push({ t: t_left, x: rectX, y: y_intersect });
                }
            }
            let t_right = (rectX + rectWidth - p1x) / dx;
            if (t_right >= 0 && t_right <= 1) {
                let y_intersect = p1y + t_right * dy;
                if (y_intersect >= rectY && y_intersect <= rectY + rectHeight) {
                    intersections.push({ t: t_right, x: rectX + rectWidth, y: y_intersect });
                }
            }
        }

        if (dy !== 0) {
            let t_top = (rectY - p1y) / dy;
            if (t_top >= 0 && t_top <= 1) {
                let x_intersect = p1x + t_top * dx;
                if (x_intersect >= rectX && x_intersect <= rectX + rectWidth) {
                    intersections.push({ t: t_top, x: x_intersect, y: rectY });
                }
            }
            let t_bottom = (rectY + rectHeight - p1y) / dy;
            if (t_bottom >= 0 && t_bottom <= 1) {
                let x_intersect = p1x + t_bottom * dx;
                if (x_intersect >= rectX && x_intersect <= rectX + rectWidth) {
                    intersections.push({ t: t_bottom, x: x_intersect, y: rectY + rectHeight });
                }
            }
        }

        let closestIntersection = null;
        let minT = Infinity;

        for (const intersection of intersections) {
            if (intersection.t >= 0 && intersection.t < minT) {
                minT = intersection.t;
                closestIntersection = intersection;
            }
        }

        if (!closestIntersection && intersections.length > 0) {
            closestIntersection = intersections[0];
        }

        return closestIntersection;
    };

    const generateCubicPath = (x1, y1, x2, y2) => {
        const controlPointX1 = x1 + (x2 - x1) * 0.3;
        const controlPointY1 = y1;
        const controlPointX2 = x2 - (x2 - x1) * 0.3;
        const controlPointY2 = y2;
        return `M${x1} ${y1} C${controlPointX1} ${controlPointY1}, ${controlPointX2} ${controlPointY2}, ${x2} ${y2}`;
    };

    const generateSmoothStepPath = (x1, y1, x2, y2) => {
        const midX = (x1 + x2) / 2;
        return `M${x1} ${y1} L${midX} ${y1} L${midX} ${y2} L${x2} ${y2}`;
    };

    const generateStraightPath = (x1, y1, x2, y2) => {
        return `M${x1} ${y1} L${x2} ${y2}`;
    };

    const generateStepPath = (x1, y1, x2, y2) => {
        return `M${x1} ${y1} L${x1} ${y2} L${x2} ${y2}`;
    };


    const animateRandomCircle = () => {
        if (!nodes || nodes.length === 0 || !links || links.length === 0) return;

        const randomNode = nodes[Math.floor(Math.random() * nodes.length)];
        const outgoingLinks = links.filter(link => link.source.id === randomNode.id);

        if (outgoingLinks.length === 0) return;

        const randomLink = outgoingLinks[Math.floor(Math.random() * outgoingLinks.length)];
        const pathElement = d3.select(svgRef.current).select('g.links').selectAll('path')
            .filter(d => d.source.id === randomLink.source.id && d.target.id === randomLink.target.id)
            .node();

        if (pathElement) {
            const totalLength = pathElement.getTotalLength();
            const circle = gRef.current.append('circle')
                .attr('r', 5)
                .attr('fill', `hsl(${Math.random() * 360}, 70%, 50%)`)
                .attr('stroke', 'black')
                .attr('stroke-width', 1);

            const randomDuration = Math.random() * (3000 - 1000) + 1000;

            circle.transition()
                .duration(randomDuration)
                .ease(d3.easeLinear)
                .attrTween("transform", function() {
                    return function(t) {
                        const p = pathElement.getPointAtLength(t * totalLength);
                        return `translate(${p.x},${p.y})`;
                    };
                })
                .remove();
        }
    };

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        const svgWidth = svgRef.current.clientWidth;
        const svgHeight = svgRef.current.clientHeight;

        svg.selectAll('*').remove();

        const defs = svg.append('defs');
        defs.append('marker')
            .attr('id', 'arrowhead')
            .attr('viewBox', '0 0 10 10')
            .attr('refX', '9')
            .attr('refY', '5')
            .attr('markerUnits', 'strokeWidth')
            .attr('markerWidth', '6')
            .attr('markerHeight', '6')
            .attr('orient', 'auto')
            .append('path')
            .attr('d', 'M 0 0 L 10 5 L 0 10 z')
            .attr('class', 'arrowhead');

        if (backgroundType === 'grid') {
            const gridSize = 20;
            defs.append('pattern')
                .attr('id', 'grid-pattern')
                .attr('width', gridSize)
                .attr('height', gridSize)
                .attr('patternUnits', 'userSpaceOnUse')
                .append('path')
                .attr('d', `M ${gridSize} 0 L 0 0 0 ${gridSize}`)
                .attr('fill', 'none')
                .attr('stroke', '#e2e8f0')
                .attr('stroke-width', '0.5');

            svg.append('rect')
                .attr('width', '100%')
                .attr('height', '100%')
                .attr('fill', 'url(#grid-pattern)');
        } else if (backgroundType === 'no-background') {
            svg.append('rect')
                .attr('width', '100%')
                .attr('height', '100%')
                .attr('fill', 'none');
        } else if (backgroundType === 'honeycomb') {
            const hexWidth = 40;
            const hexHeight = Math.sqrt(3) / 2 * hexWidth;
            defs.append('pattern')
                .attr('id', 'honeycomb-pattern')
                .attr('width', hexWidth * 1.5)
                .attr('height', hexHeight * 2)
                .attr('patternUnits', 'userSpaceOnUse')
                .html(`
                        <path d="M${hexWidth * 0.25},${hexHeight * 2}L${hexWidth * 0.75},${hexHeight * 2}L${hexWidth},${hexHeight}L${hexWidth * 0.75},0L${hexWidth * 0.25},0L0,${hexHeight}Z" />
                        <path transform="translate(${hexWidth * 0.75}, ${hexHeight})" d="M${hexWidth * 0.25},${hexHeight * 2}L${hexWidth * 0.75},${hexHeight * 2}L${hexWidth},${hexHeight}L${hexWidth * 0.75},0L${hexWidth * 0.25},0L0,${hexHeight}Z" />
                    `);
            svg.append('rect')
                .attr('width', '100%')
                .attr('height', '100%')
                .attr('fill', 'url(#honeycomb-pattern)');
        }
        else {
            svg.append('rect')
                .attr('width', '100%')
                .attr('height', '100%')
                .attr('fill', '#f7fafc');
        }

        const g = svg.append('g');
        gRef.current = g;

        const simulation = d3.forceSimulation(nodes)
            .force('link', d3.forceLink(links).id(d => d.id).distance(150))
            .force('charge', d3.forceManyBody().strength(-300))
            .force('center', d3.forceCenter(svgWidth / 2, svgHeight / 2));

        nodes.forEach(node => {
            if (node.x !== undefined && node.y !== undefined) {
                node.fx = node.x;
                node.fy = node.y;
            }
        });

        simulation.on('tick', ticked);

        const zoom = d3.zoom()
            .scaleExtent([0.1, 4])
            .on('zoom', (event) => {
                g.attr('transform', event.transform);
            });

        svg.call(zoom);

        const linkElements = g.append('g')
            .attr('class', 'links')
            .selectAll('path')
            .data(links)
            .enter().append('path')
            .attr('class', 'edge-line');

        const linkLabelElements = g.append('g')
            .attr('class', 'link-labels')
            .selectAll('text')
            .data(links.filter(d => d.label))
            .enter().append('text')
            .attr('class', 'edge-label-text')
            .text(d => d.label);

        const nodeElements = g.append('g')
            .attr('class', 'nodes')
            .selectAll('g')
            .data(nodes)
            .enter().append('g')
            .call(d3.drag()
                .on('start', dragstarted)
                .on('drag', dragged)
                .on('end', dragended))
            .on('click', function(event, d) {
                nodeClicked(event, d);
            });

        nodeElements.append('rect')
            .attr('width', d => d.width)
            .attr('height', d => d.height)
            .attr('class', 'node-rect');

        nodeElements.each(function(d) {
            const gNode = d3.select(this);
            if (d.id === 'buttonNode') {
                const foreignObject = gNode.append('foreignObject')
                    .attr('x', 0)
                    .attr('y', 0)
                    .attr('width', d.width)
                    .attr('height', d.height);

                const div = foreignObject.append('xhtml:div')
                    .style('width', `${d.width}px`)
                    .style('height', `${d.height}px`)
                    .style('display', 'flex')
                    .style('align-items', 'center')
                    .style('justify-content', 'center')
                    .style('padding', '5px')
                    .style('box-sizing', 'border-box')
                    .node();
                ReactDOM.createRoot(div).render(
                    <Button type="primary" onClick={showModal}>Open Table</Button>
                );
            } else if (d.text) {
                gNode.append('text')
                    .text(d => d.text)
                    .attr('x', d => d.width / 2)
                    .attr('y', d => d.height / 2)
                    .attr('class', 'node-text');
            } else if (d.html) {
                const foreignObject = gNode.append('foreignObject')
                    .attr('x', 0)
                    .attr('y', 0)
                    .attr('width', d.width)
                    .attr('height', d.height);

                const div = foreignObject.append('xhtml:div')
                    .style('width', `${d.width}px`)
                    .style('height', `${d.height}px`)
                    .style('display', 'flex')
                    .style('align-items', 'center')
                    .style('justify-content', 'center')
                    .style('padding', '5px')
                    .style('box-sizing', 'border-box')
                    .html(d.html);

            }
            gNode.append('text')
                .attr('class', 'node-coordinates')
                .attr('x', d => d.width / 2)
                .attr('y', d => d.height + 5)
                .text(d => `(${d.x ? d.x.toFixed(0) : 'N/A'}, ${d.y ? d.y.toFixed(0) : 'N/A'})`);
        });

        function nodeClicked(event, clickedNode) {
            links.forEach(link => {
                if (link.source.id === clickedNode.id) {
                    const pathElement = linkElements.filter(d => d.source.id === link.source.id && d.target.id === link.target.id).node();

                    if (pathElement) {
                        const totalLength = pathElement.getTotalLength();
                        const circle = gRef.current.append('circle')
                            .attr('r', 5)
                            .attr('fill', 'orange')
                            .attr('stroke', 'black')
                            .attr('stroke-width', 1);

                        const randomDuration = Math.random() * (3000 - 1000) + 1000;

                        circle.transition()
                            .duration(randomDuration)
                            .ease(d3.easeLinear)
                            .attrTween("transform", function() {
                                return function(t) {
                                    const p = pathElement.getPointAtLength(t * totalLength);
                                    return `translate(${p.x},${p.y})`;
                                };
                            })
                            .remove();
                    }
                }
            });
        }

        function ticked() {
            linkElements
                .attr('d', d => {
                    const sourceCenterX = d.source.x;
                    const sourceCenterY = d.source.y;
                    const targetCenterX = d.target.x;
                    const targetCenterY = d.target.y;

                    const sourceRectX = sourceCenterX - d.source.width / 2;
                    const sourceRectY = sourceCenterY - d.source.height / 2;
                    const targetRectX = targetCenterX - d.target.width / 2;
                    const targetRectY = targetCenterY - d.target.height / 2;

                    const startPoint = getRectIntersection(
                        sourceRectX, sourceRectY, d.source.width, d.source.height,
                        sourceCenterX, sourceCenterY, targetCenterX, targetCenterY
                    );

                    const endPoint = getRectIntersection(
                        targetRectX, targetRectY, d.target.width, d.target.height,
                        targetCenterX, targetCenterY, sourceCenterX, sourceCenterY
                    );

                    const finalX1 = startPoint ? startPoint.x : sourceCenterX;
                    const finalY1 = startPoint ? startPoint.y : sourceCenterY;
                    const finalX2 = endPoint ? endPoint.x : targetCenterX;
                    const finalY2 = endPoint ? endPoint.y : targetCenterY;

                    const type = d.type || 'straight';

                    switch (type) {
                        case 'straight':
                            return generateStraightPath(finalX1, finalY1, finalX2, finalY2);
                        case 'step':
                            return generateStepPath(finalX1, finalY1, finalX2, finalY2);
                        case 'smoothstep':
                            return generateSmoothStepPath(finalX1, finalY1, finalX2, finalY2);
                        case 'bezier':
                            return generateCubicPath(finalX1, finalY1, finalX2, finalY2);
                        default:
                            return generateStraightPath(finalX1, finalY1, finalX2, finalY2);
                    }
                });

            nodeElements
                .attr('transform', d => `translate(${d.x - d.width / 2},${d.y - d.height / 2})`);

            nodeElements.select('.node-coordinates')
                .text(d => `(${d.x ? d.x.toFixed(0) : 'N/A'}, ${d.y ? d.y.toFixed(0) : 'N/A'})`);

            linkLabelElements
                .attr('x', d => (d.source.x + d.target.x) / 2)
                .attr('y', d => (d.source.y + d.target.y) / 2 - 5);
        }

        function dragstarted(event, d) {
            event.sourceEvent.stopPropagation();
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(event, d) {
            d.fx = event.x;
            d.fy = event.y;
        }

        function dragended(event, d) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }

        return () => simulation.stop();

    }, [nodes, links, backgroundType]);

    return (
        <div className="diagram-container">
            <div id="flow-diagram-container" className="w-full h-full flex justify-center items-center">
                <svg ref={svgRef} id="flow-diagram-svg"></svg>
            </div>
            <div style={{ position: 'absolute', bottom: 20, right: 20 }}>
                <Button onClick={animateRandomCircle}>Animate Random Circle</Button>
            </div>
            <Modal
                title="Ant Design Table Data"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                width={800}
            >
                <Table dataSource={tableData} columns={tableColumns} pagination={false} />
            </Modal>
        </div>
    );
};