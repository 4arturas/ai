function node_Create(data) {
    return { data, next: null };
}

class LinkedList {
    constructor() {
        this.head = null;
    }

    addToHead(data) {
        const newHead = node_Create(data);
        const currentHead = this.head;
        this.head = newHead;
        if (currentHead) {
            this.head.next = currentHead;
        }
    }

    addToTail(data) {
        const newNode = node_Create(data);
        if (!this.head) {
            this.head = newNode;
        } else {
            let tail = this.head;
            while (tail.next) {
                tail = tail.next;
            }
            tail.next = newNode;
        }
    }

    removeHead() {
        const removedHead = this.head;
        if (!removedHead) {
            return null;
        }
        this.head = removedHead.next;
        return removedHead.data;
    }
}

class Queue {
    constructor() {
        this.queue = new LinkedList();
        this.size = 0;
    }

    isEmpty() {
        return this.size === 0;
    }

    enqueue(data) {
        this.queue.addToTail(data);
        this.size++;
    }

    peek() {
        if (this.isEmpty()) {
            return null;
        }
        return this.queue.head.data;
    }

    dequeue() {
        if (this.isEmpty()) {
            throw new Error("Queue is empty!");
        }
        const data = this.queue.removeHead();
        this.size--;
        return data;
    }
}

function edge_Create(start, end, weight)
{
    return { start, end, weight };
}

class Edge {
    constructor(start, end, weight) {
        this.start = start;
        this.end = end;
        this.weight = weight;
    }

    getStart() {
        return this.start;
    }

    getEnd() {
        return this.end;
    }

    getWeight() {
        return this.weight;
    }
}

class Vertex {
    constructor(data) {
        this.data = data;
        this.edges = [];
    }

    addEdge(endVertex, weight) {
        this.edges.push(new Edge(this, endVertex, weight));
    }

    removeEdge(endVertex) {
        this.edges = this.edges.filter(edge => edge.getEnd() !== endVertex);
    }

    getData() {
        return this.data;
    }

    getEdges() {
        return this.edges;
    }

    print(showWeight) {
        let message = "";

        if (this.edges.length === 0) {
            console.log(this.data + " -->");
            return;
        }

        this.edges.forEach((edge, i) => {
            if (i === 0) {
                message += edge.getStart().data + " -->  ";
            }

            message += edge.getEnd().data;

            if (showWeight) {
                message += " (" + edge.getWeight() + ")";
            }

            if (i !== this.edges.length - 1) {
                message += ", ";
            }
        });

        console.log(message);
    }
}

class Graph {
    constructor(isWeighted, isDirected) {
        this.vertices = [];
        this.isWeighted = isWeighted;
        this.isDirected = isDirected;
    }

    addVertex(data) {
        const newVertex = new Vertex(data);
        this.vertices.push(newVertex);
        return newVertex;
    }

    addEdge(vertex1, vertex2, weight) {
        if (!this.isWeighted) {
            weight = null;
        }
        vertex1.addEdge(vertex2, weight);
        if (!this.isDirected) {
            vertex2.addEdge(vertex1, weight);
        }
    }

    removeEdge(vertex1, vertex2) {
        vertex1.removeEdge(vertex2);
        if (!this.isDirected) {
            vertex2.removeEdge(vertex1);
        }
    }

    removeVertex(vertex) {
        this.vertices = this.vertices.filter(v => v !== vertex);
    }

    getVertices() {
        return this.vertices;
    }

    isWeighted() {
        return this.isWeighted;
    }

    isDirected() {
        return this.isDirected;
    }

    getVertexByValue(value) {
        return this.vertices.find(v => v.getData() === value) || null;
    }

    print() {
        this.vertices.forEach(v => v.print(this.isWeighted));
    }
}

class TestGraph {
    constructor() {
        this.testGraph = new Graph(false, true);
        const startNode = this.testGraph.addVertex("v0.0.0");
        const v1 = this.testGraph.addVertex("v1.0.0");
        const v2 = this.testGraph.addVertex("v2.0.0");

        const v11 = this.testGraph.addVertex("v1.1.0");
        const v12 = this.testGraph.addVertex("v1.2.0");
        const v21 = this.testGraph.addVertex("v2.1.0");

        const v111 = this.testGraph.addVertex("v1.1.1");
        const v112 = this.testGraph.addVertex("v1.1.2");
        const v121 = this.testGraph.addVertex("v1.2.1");
        const v211 = this.testGraph.addVertex("v2.1.1");

        this.testGraph.addEdge(startNode, v1, null);
        this.testGraph.addEdge(startNode, v2, null);

        this.testGraph.addEdge(v1, v11, null);
        this.testGraph.addEdge(v1, v12, null);
        this.testGraph.addEdge(v2, v21, null);

        this.testGraph.addEdge(v11, v111, null);
        this.testGraph.addEdge(v11, v112, null);
        this.testGraph.addEdge(v12, v121, null);
        this.testGraph.addEdge(v21, v211, null);

        // Create a cycle
        this.testGraph.addEdge(v211, v2, null);
    }

    getStartingVertex() {
        return this.testGraph.getVertices()[0];
    }
}

class GraphTraverser {
    static depthFirstTraversal(start, visitedVertices) {
        console.log(start.getData());

        start.getEdges().forEach(edge => {
            const neighbor = edge.getEnd();
            if (!visitedVertices.includes(neighbor)) {
                visitedVertices.push(neighbor);
                GraphTraverser.depthFirstTraversal(neighbor, visitedVertices);
            }
        });
    }

    static breadthFirstSearch(start, visitedVertices) {
        const visitQueue = new Queue();
        visitQueue.enqueue(start);
        while (!visitQueue.isEmpty()) {
            const current = visitQueue.dequeue();
            console.log(current.getData());

            current.getEdges().forEach(edge => {
                const neighbor = edge.getEnd();
                if (!visitedVertices.includes(neighbor)) {
                    visitedVertices.push(neighbor);
                    visitQueue.enqueue(neighbor);
                }
            });
        }
    }
}

class QueueObject {
    constructor(vertex, priority) {
        this.vertex = vertex;
        this.priority = priority;
    }

    compareTo(other) {
        if (this.priority === other.priority) {
            return 0;
        }
        return this.priority > other.priority ? 1 : -1;
    }
}

class PriorityQueue {
    constructor() {
        this.items = [];
    }

    add(item) {
        let added = false;
        for (let i = 0; i < this.items.length; i++) {
            if (item.compareTo(this.items[i]) < 0) {
                this.items.splice(i, 0, item);
                added = true;
                break;
            }
        }
        if (!added) {
            this.items.push(item);
        }
    }

    poll() {
        return this.items.shift();
    }

    size() {
        return this.items.length;
    }
}

class Dijkstra {
    static dijkstra(g, startingVertex) {
        const distances = new Map();
        const previous = new Map();
        const queue = new PriorityQueue();

        queue.add(new QueueObject(startingVertex, 0));

        for (const v of g.getVertices()) {
            if (v !== startingVertex) {
                distances.set(v.getData(), Number.MAX_SAFE_INTEGER);
            }
            previous.set(v.getData(), new Vertex("Null"));
        }

        distances.set(startingVertex.getData(), 0);

        while (queue.size() !== 0) {
            const current = queue.poll().vertex;
            for (const e of current.getEdges()) {
                const alternative = distances.get(current.getData()) + e.getWeight();
                const neighborValue = e.getEnd().getData();
                if (alternative < distances.get(neighborValue)) {
                    distances.set(neighborValue, alternative);
                    previous.set(neighborValue, current);
                    queue.add(new QueueObject(e.getEnd(), distances.get(neighborValue)));
                }
            }
        }

        return [distances, previous];
    }

    static shortestPathBetween(g, startingVertex, targetVertex) {
        const [distances, previous] = Dijkstra.dijkstra(g, startingVertex);
        const distance = distances.get(targetVertex.getData());
        console.log(`Shortest Distance between ${startingVertex.getData()} and ${targetVertex.getData()}`);
        console.log(distance);

        const path = [];
        let v = targetVertex;

        while (v.getData() !== "Null") {
            path.unshift(v);
            v = previous.get(v.getData());
        }

        console.log("Shortest Path");
        for (const pathVertex of path) {
            console.log(pathVertex.getData());
        }
    }

    static dijkstraResultPrinter(d) {
        console.log("Distances:\n");
        for (const key of d[0].keys()) {
            console.log(`${key}: ${d[0].get(key)}`);
        }
        console.log("\nPrevious:\n");
        for (const key of d[1].keys()) {
            console.log(`${key}: ${d[1].get(key).getData()}`);
        }
    }
}

// Equivalent of GraphTraverser's main method for testing DFS/BFS
function mainTraverser() {
    const test = new TestGraph();
    const startingVertex = test.getStartingVertex();
    const visitedVertices1 = [startingVertex];
    const visitedVertices2 = [startingVertex];
    console.log("DFS:");
    GraphTraverser.depthFirstTraversal(startingVertex, visitedVertices1);
    console.log("BFS:");
    GraphTraverser.breadthFirstSearch(startingVertex, visitedVertices2);
}

// Equivalent of Dijkstra's main method for testing Dijkstra's algorithm
function mainDijkstra() {
    const testGraph = new Graph(true, true);
    const a = testGraph.addVertex("A");
    const b = testGraph.addVertex("B");
    const c = testGraph.addVertex("C");
    const d = testGraph.addVertex("D");
    const e = testGraph.addVertex("E");
    const f = testGraph.addVertex("F");
    const g = testGraph.addVertex("G");

    testGraph.addEdge(a, c, 100);
    testGraph.addEdge(a, b, 3);
    testGraph.addEdge(a, d, 4);
    testGraph.addEdge(d, c, 3);
    testGraph.addEdge(d, e, 8);
    testGraph.addEdge(e, b, -2);
    testGraph.addEdge(e, f, 10);
    testGraph.addEdge(b, g, 9);
    testGraph.addEdge(e, g, -50);

    Dijkstra.dijkstraResultPrinter(Dijkstra.dijkstra(testGraph, a));
    Dijkstra.shortestPathBetween(testGraph, a, g);
}

// Run both main functions
mainTraverser();
console.log("\n--- Dijkstra Test ---\n");
mainDijkstra();