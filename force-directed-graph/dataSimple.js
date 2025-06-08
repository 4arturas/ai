const data = {
    nodes: [
        { id: 'start', html: '<div style="background-color: #ffcc00; padding: 10px; border-radius: 5px;"><strong>Start</strong><br/>Process</div>', width: 120, height: 50, x: 889, y: 444 },
        { id: 'end', text: 'End Process', width: 120, height: 50, x: 1144, y: 610 },
    ],
    edges: [
        { source: 'start', target: 'end', type: edgeTypes.straight, markerType: 'arrow' },
    ],
    render: function(gNode, d) {
        if (d.text) {
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