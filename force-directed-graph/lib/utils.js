const copyNodesToClipboard = (nodesData) => {
    const nodesToSave = nodesData.map(({ fx, fy, ...rest }) => ({
        ...rest,
        x: rest.x ? parseFloat(rest.x.toFixed(0)) : undefined,
        y: rest.y ? parseFloat(rest.y.toFixed(0)) : undefined,
    }));
    const jsonString = JSON.stringify(nodesToSave, null, 1);
    navigator.clipboard.writeText(jsonString)
        .then(() => message.success('Nodes copied to clipboard!'))
        .catch(err => {
            console.error('Failed to copy nodes: ', err);
            message.error('Failed to copy nodes to clipboard.');
        });
};