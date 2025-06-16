function getRectIntersection(rectX, rectY, rectWidth, rectHeight, p1x, p1y, p2x, p2y) {
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
        else if (intersection.t === minT && closestIntersection && Math.abs(intersection.x - p2x) + Math.abs(intersection.y - p2y) < Math.abs(closestIntersection.x - p2x) + Math.abs(closestIntersection.y - p2y)) {
            closestIntersection = intersection;
        }
    }
    return closestIntersection;
}

const Node = ({ id, content, width, height, x, y, onDrag, showCoordinates }) => {
    const nodeRef = React.useRef();
    const currentPosRef = React.useRef({ x, y });

    useEffect(() => {
        currentPosRef.current = { x, y };
    }, [x, y]);

    useEffect(() => {
        const nodeElement = d3.select(nodeRef.current);

        if (!nodeElement.empty()) {
            const dragBehavior = d3.drag()
                .filter(event => !event.target.classList.contains('ant-btn') && !event.target.classList.contains('ant-input'))
                .subject(function() {
                    return { x: currentPosRef.current.x, y: currentPosRef.current.y };
                })
                .on('start', function(event) {
                    onDrag(id, 'start');
                })
                .on('drag', function(event) {
                    onDrag(id, 'drag', event.x, event.y);
                })
                .on('end', function(event) {
                    onDrag(id, 'end');
                });

            nodeElement.call(dragBehavior);

            return () => {
                nodeElement.on('.drag', null);
            };
        }
    }, [id, onDrag]);

    const displayX = Math.round(x);
    const displayY = Math.round(y);

    return (
        <g ref={nodeRef} transform={`translate(${x - width / 2},${y - height / 2})`}>
            <rect width={width} height={height} className="node-rect" />
            <foreignObject x="0" y="0" width={width} height={height} className="node-content-foreignobject">
                <div xmlns="http://www.w3.org/1999/xhtml" className="node-content">
                    {content}
                </div>
            </foreignObject>
            {showCoordinates && (
                <text x={width / 2} y={height + 20} className="node-coordinate-text">
                    ({displayX}, {displayY})
                </text>
            )}
        </g>
    );
};

const Edge = ({ source, target, label, nodes }) => {
    const sourceNode = nodes.find(n => n.id === source);
    const targetNode = nodes.find(n => n.id === target);

    if (!sourceNode || !targetNode) {
        return null;
    }

    const sourceCenterX = sourceNode.x;
    const sourceCenterY = sourceNode.y;
    const targetCenterX = targetNode.x;
    const targetCenterY = targetNode.y;

    const sourceRectX = sourceCenterX - sourceNode.width / 2;
    const sourceRectY = sourceCenterY - sourceNode.height / 2;
    const targetRectX = targetCenterX - targetNode.width / 2;
    const targetRectY = targetCenterY - targetNode.height / 2;

    const startPoint = getRectIntersection(
        sourceRectX, sourceRectY, sourceNode.width, sourceNode.height,
        sourceCenterX, sourceCenterY, targetCenterX, targetCenterY
    );

    const endPoint = getRectIntersection(
        targetRectX, targetRectY, targetNode.width, targetNode.height,
        targetCenterX, targetCenterY, sourceCenterX, sourceCenterY
    );

    const finalX1 = startPoint ? startPoint.x : sourceCenterX;
    const finalY1 = startPoint ? startPoint.y : sourceCenterY;
    const finalX2 = endPoint ? endPoint.x : targetCenterX;
    const finalY2 = endPoint ? endPoint.y : targetCenterY;

    return (
        <>
            <line x1={finalX1} y1={finalY1} x2={finalX2} y2={finalY2} className="edge-line" />
            {label && (
                <text
                    x={(finalX1 + finalX2) / 2}
                    y={(finalY1 + finalY2) / 2 - 5}
                    className="edge-label-text"
                >
                    {label}
                </text>
            )}
        </>
    );
};

const GraphMap = React.forwardRef(({ width, height, children, showNodeCoordinates }, ref) => {
    const [internalNodes, setInternalNodes] = React.useState([]);
    const [internalLinks, setInternalLinks] = React.useState([]);

    useEffect(() => {
        const parsedNodes = [];
        const parsedLinks = [];
        Children.forEach(children, child => {
            if (isValidElement(child)) {
                if (child.type === Node) {
                    parsedNodes.push({
                        id: child.props.id,
                        content: child.props.children,
                        width: child.props.width,
                        height: child.props.height,
                        x: child.props.x,
                        y: child.props.y
                    });
                } else if (child.type === Edge) {
                    parsedLinks.push({
                        source: child.props.source,
                        target: child.props.target,
                        label: child.props.children
                    });
                }
            }
        });
        setInternalNodes(parsedNodes);
        setInternalLinks(parsedLinks);
    }, [children]);

    const handleNodeDrag = useCallback((id, type, newX, newY) => {
        if (type === 'drag' && newX != null && newY != null) {
            setInternalNodes(prevNodes =>
                prevNodes.map(node =>
                    node.id === id ? { ...node, x: newX, y: newY } : node
                )
            );
        }
    }, []);

    const animateCircle = useCallback((sourceId, targetId, duration, color) => {
        const sourceNode = internalNodes.find(n => n.id === sourceId);
        const targetNode = internalNodes.find(n => n.id === targetId);

        if (!sourceNode || !targetNode) {
            return;
        }

        const sourceCenterX = sourceNode.x;
        const sourceCenterY = sourceNode.y;
        const targetCenterX = targetNode.x;
        const targetCenterY = targetNode.y;

        const sourceRectX = sourceCenterX - sourceNode.width / 2;
        const sourceRectY = sourceCenterY - sourceNode.height / 2;
        const targetRectX = targetCenterX - targetNode.width / 2;
        const targetRectY = targetCenterY - targetNode.height / 2;

        const startPoint = getRectIntersection(
            sourceRectX, sourceRectY, sourceNode.width, sourceNode.height,
            sourceCenterX, sourceCenterY, targetCenterX, targetCenterY
        );

        const endPoint = getRectIntersection(
            targetRectX, targetRectY, targetNode.width, targetNode.height,
            targetCenterX, targetCenterY, sourceCenterX, sourceCenterY
        );

        if (!startPoint || !endPoint) {
            return;
        }

        const svg = d3.select('#flow-diagram-svg');

        const circle = svg.append('circle')
            .attr('cx', startPoint.x)
            .attr('cy', startPoint.y)
            .attr('r', 5)
            .attr('fill', color)
            .attr('opacity', 1);

        circle.transition()
            .duration(duration)
            .ease(d3.easeLinear)
            .attrTween('cx', function() {
                return d3.interpolateNumber(startPoint.x, endPoint.x);
            })
            .attrTween('cy', function() {
                return d3.interpolateNumber(startPoint.y, endPoint.y);
            })
            .on('end', function() {
                d3.select(this).remove();
            });
    }, [internalNodes]);

    const animateRandomCircle = useCallback(() => {
        if (internalNodes.length === 0 || internalLinks.length === 0) {
            return;
        }

        const availableSourceNodes = internalNodes.filter(node => internalLinks.some(link => link.source === node.id));
        if (availableSourceNodes.length === 0) {
            return;
        }

        const randomSourceIndex = Math.floor(Math.random() * availableSourceNodes.length);
        const sourceNode = availableSourceNodes[randomSourceIndex];

        const possibleTargets = internalLinks.filter(link => link.source === sourceNode.id)
            .map(link => internalNodes.find(node => node.id === link.target));

        if (possibleTargets.length === 0) {
            return;
        }

        const randomTargetIndex = Math.floor(Math.random() * possibleTargets.length);
        const targetNode = possibleTargets[randomTargetIndex];

        const randomDuration = Math.floor(Math.random() * 3000) + 2000;
        const randomColor = `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`;

        animateCircle(sourceNode.id, targetNode.id, randomDuration, randomColor);
    }, [internalNodes, internalLinks, animateCircle]);

    useImperativeHandle(ref, () => ({
        animateCircle: animateCircle,
        animateRandomCircle: animateRandomCircle
    }));

    return (
        <svg id="flow-diagram-svg" width={width} height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
            <defs>
                <marker
                    id="arrowhead"
                    viewBox="0 0 10 10"
                    refX="9"
                    refY="5"
                    markerUnits="strokeWidth"
                    markerHeight="6"
                    orient="auto"
                >
                    <path d="M 0 0 L 10 5 L 0 10 z" className="arrowhead" />
                </marker>
            </defs>
            <g className="links">
                {internalLinks.map((link, index) => (
                    <Edge key={index} source={link.source} target={link.target} label={link.label} nodes={internalNodes} />
                ))}
            </g>
            <g className="nodes">
                {internalNodes.map(node => (
                    <Node
                        key={node.id}
                        id={node.id}
                        content={node.content}
                        width={node.width}
                        height={node.height}
                        x={node.x}
                        y={node.y}
                        onDrag={handleNodeDrag}
                        showCoordinates={showNodeCoordinates}
                    />
                ))}
            </g>
        </svg>
    );
});