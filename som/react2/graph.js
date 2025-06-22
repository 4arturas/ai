const Node = ({ id, x, y, width, height, onDrag, children }) => {
    const nodeRef = useRef();
    const currentPosRef = useRef({ x, y });

    useEffect(() => {
        currentPosRef.current = { x, y };
    }, [x, y]);

    useEffect(() => {
        const nodeElement = d3.select(nodeRef.current);

        const dragBehavior = d3.drag()
            .subject(function() {
                return { x: currentPosRef.current.x, y: currentPosRef.current.y };
            })
            .on('start', function(event) {
                onDrag(id, 'start', event);
            })
            .on('drag', function(event) {
                onDrag(id, 'drag', event);
            })
            .on('end', function(event) {
                onDrag(id, 'end', event);
            });

        nodeElement.call(dragBehavior);

        return () => {
            nodeElement.on('.drag', null);
        };
    }, [id, onDrag]);

    return (
        <g ref={nodeRef} transform={`translate(${x - width / 2},${y - height / 2})`}>
            <rect width={width} height={height} className="node-rect" />
            <foreignObject x="0" y="0" width={width} height={height} className="node-content-foreignobject">
                <div xmlns="http://www.w3.org/1999/xhtml" className="node-content">
                    {children}
                </div>
            </foreignObject>
        </g>
    );
};

const Edge = ({ source, target, label, linkHorizontal, linkVertical }) => {
    const dx_center = target.x - source.x;
    const dy_center = target.y - source.y;
    const isPrimarilyHorizontal = Math.abs(dx_center) > Math.abs(dy_center);

    let p0 = { x: source.x, y: source.y };
    let p3 = { x: target.x, y: target.y };

    if (isPrimarilyHorizontal) {
        p0.x = source.x + (dx_center > 0 ? source.width / 2 : -source.width / 2);
        p0.y = source.y;
        p3.x = target.x + (dx_center > 0 ? -target.width / 2 : target.width / 2);
        p3.y = target.y;
    } else {
        p0.x = source.x;
        p0.y = source.y + (dy_center > 0 ? source.height / 2 : -source.height / 2);
        p3.x = target.x;
        p3.y = target.y + (dy_center > 0 ? -target.height / 2 : target.height / 2);
    }

    const pathData = isPrimarilyHorizontal
        ? linkHorizontal({ source: p0, target: p3 })
        : linkVertical({ source: p0, target: p3 });

    let targetCx = target.x;
    let targetCy = target.y;
    if (isPrimarilyHorizontal) {
        targetCx = target.x + (dx_center > 0 ? -target.width / 2 : target.width / 2);
    } else {
        targetCy = target.y + (dy_center > 0 ? -target.height / 2 : target.height / 2);
    }

    return (
        <>
            <path d={pathData} className="edge-line" />
            {label && (
                <text
                    x={(source.x + target.x) / 2}
                    y={(source.y + target.y) / 2 - 5}
                    className="edge-label-text"
                >
                    {label}
                </text>
            )}
            <circle cx={targetCx} cy={targetCy} r={5} className="connection-point" />
        </>
    );
};

const FlowDiagram = ({ width, height, children }) => {
    const [nodes, setNodes] = useState([]);
    const [links, setLinks] = useState([]);

    const linkHorizontal = d3.linkHorizontal()
        .x(d => d.x)
        .y(d => d.y);

    const linkVertical = d3.linkVertical()
        .x(d => d.x)
        .y(d => d.y);

    useEffect(() => {
        const parsedNodes = [];
        const parsedLinks = [];

        React.Children.forEach(children, child => {
            if (React.isValidElement(child)) {
                if (child.type === Node) {
                    parsedNodes.push({
                        id: child.props.id,
                        children: child.props.children,
                        width: child.props.width,
                        height: child.props.height,
                        x: child.props.x,
                        y: child.props.y,
                    });
                } else if (child.type === Edge) {
                    parsedLinks.push({
                        source: child.props.source,
                        target: child.props.target,
                        label: child.props.children,
                    });
                }
            }
        });

        setNodes(parsedNodes);
        setLinks(parsedLinks);
    }, [children]);

    const handleNodeDrag = useCallback((id, type, event) => {
        setNodes(prevNodes => {
            return prevNodes.map(node => {
                if (node.id === id) {
                    return { ...node, x: event.x, y: event.y };
                }
                return node;
            });
        });
    }, []);

    return (
        <div className="flow-diagram-container">
            <svg id="flow-diagram-svg" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
                <g className="links">
                    {links.map((link, index) => {
                        const sourceNode = nodes.find(n => n.id === link.source);
                        const targetNode = nodes.find(n => n.id === link.target);

                        if (!sourceNode || !targetNode) {
                            console.warn(`Skipping link ${link.source} -> ${link.target}: one or both nodes not found.`);
                            return null;
                        }

                        return (
                            <Edge
                                key={index}
                                source={sourceNode}
                                target={targetNode}
                                label={link.label}
                                linkHorizontal={linkHorizontal}
                                linkVertical={linkVertical}
                            />
                        );
                    })}
                </g>
                <g className="nodes">
                    {nodes.map(node => (
                        <Node
                            key={node.id}
                            id={node.id}
                            width={node.width}
                            height={node.height}
                            x={node.x}
                            y={node.y}
                            onDrag={handleNodeDrag}
                        >
                            {node.children}
                        </Node>
                    ))}
                </g>
            </svg>
        </div>
    );
};