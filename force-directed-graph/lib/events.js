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