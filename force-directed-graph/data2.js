const data2 = {
    nodes: [
        { id: 'start', html: '<div style="background-color: #ffcc00; padding: 10px; border-radius: 5px;"><strong>Start</strong><br/>Process</div>', width: 120, height: 50, x: 100, y: 200 },
        { id: 'step1', text: 'Gather Data', width: 120, height: 50, x: 300, y: 200 },
        { id: 'decision', text: 'Is Valid?', width: 100, height: 60, x: 500, y: 400 },
        { id: 'step3a', text: 'Process Valid', width: 120, height: 50, x: 300, y: 600 },
        { id: 'canvasNode', html: '<canvas style="width: 250px; height: 200px; border: 1px solid #ddd;"></canvas>', width: 250, height: 200, x: 700, y: 600 },
        { id: 'reactNode', width: 180, height: 80, x: 500, y: 700 },
        { id: 'end', text: 'End Process', width: 120, height: 50, x: 500, y: 800 }
    ],
    edges: [
        { source: 'start', target: 'step1', type: edgeTypes.straight, markerType: 'arrow' },
        { source: 'step1', target: 'decision', type: edgeTypes.straight, markerType: 'arrow' },
        { source: 'decision', target: 'step3a', label: 'Yes', type: edgeTypes.straight, markerType: 'arrow' },
        { source: 'decision', target: 'canvasNode', label: 'Draw', type: edgeTypes.straight, markerType: 'circle' },
        { source: 'step3a', target: 'reactNode', label: 'To React', type: edgeTypes.straight, markerType: 'arrow' },
        { source: 'reactNode', target: 'end', label: 'Done', type: edgeTypes.straight, markerType: 'arrow' },
        { source: 'canvasNode', target: 'end', type: edgeTypes.straight, markerType: 'circle' }
    ],
    render: function(gNode, d) {
        if (d.id === 'reactNode') {
            const foreignObject = gNode.append('foreignObject')
                .attr('x', 0)
                .attr('y', 0)
                .attr('width', d.width)
                .attr('height', d.height);

            const div = foreignObject.append('xhtml:div')
                .style('width', `${d.width}px`)
                .style('height', `${d.height}px`)
                .style('display', 'flex')
                .style('flex-direction', 'column')
                .style('align-items', 'center')
                .style('justify-content', 'center')
                .style('padding', '5px')
                .style('box-sizing', 'border-box')
                .style('background-color', '#a0c4ff')
                .style('border-radius', '8px')
                .node();

            ReactDOM.createRoot(div).render(<MyReactComponent />);
        } else if (d.text) {
            gNode.append('text')
                .text(d.text)
                .attr('x', d.width / 2)
                .attr('y', d.height / 2)
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
            .attr('x', d.width / 2)
            .attr('y', d.height + 5)
            .text(d => `(${d.x ? d.x.toFixed(0) : 'N/A'}, ${d.y ? d.y.toFixed(0) : 'N/A'})`);
    }
};