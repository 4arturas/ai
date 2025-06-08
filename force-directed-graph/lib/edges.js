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