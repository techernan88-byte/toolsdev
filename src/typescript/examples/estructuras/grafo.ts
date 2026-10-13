// ─── Grafo: nodos conectados por aristas (con peso) ───
// Usos: mapas y rutas, redes sociales, dependencias entre tareas, recomendaciones.

export class Graph<T> {
  // Lista de adyacencia: cada nodo → sus vecinos y el coste para llegar
  private adjacency = new Map<T, Map<T, number>>();

  addEdge(from: T, to: T, weight = 1, directed = false): this {
    if (!this.adjacency.has(from)) this.adjacency.set(from, new Map());
    if (!this.adjacency.has(to)) this.adjacency.set(to, new Map());
    this.adjacency.get(from)!.set(to, weight);
    if (!directed) this.adjacency.get(to)!.set(from, weight);
    return this;
  }

  neighbors(node: T): T[] {
    return [...(this.adjacency.get(node)?.keys() ?? [])];
  }

  /** BFS (en anchura): camino con MENOS saltos. Usa una cola. O(V + E) */
  shortestPathBFS(start: T, goal: T): T[] | null {
    const previous = new Map<T, T | null>([[start, null]]);
    const queue: T[] = [start];

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (current === goal) return this.buildPath(previous, goal);
      for (const next of this.neighbors(current)) {
        if (!previous.has(next)) {
          previous.set(next, current);
          queue.push(next);
        }
      }
    }
    return null;
  }

  /** DFS (en profundidad): recorrer todo lo alcanzable. Usa recursión (una pila). O(V + E) */
  depthFirst(start: T, visited = new Set<T>()): T[] {
    visited.add(start);
    for (const next of this.neighbors(start)) {
      if (!visited.has(next)) this.depthFirst(next, visited);
    }
    return [...visited];
  }

  /** Dijkstra: camino más BARATO teniendo en cuenta los pesos */
  dijkstra(start: T, goal: T): { path: T[]; cost: number } | null {
    const distances = new Map<T, number>([[start, 0]]);
    const previous = new Map<T, T | null>([[start, null]]);
    const pending = new Set<T>(this.adjacency.keys());

    while (pending.size > 0) {
      // Nodo pendiente con menor distancia (con un heap sería más eficiente)
      let current: T | undefined;
      for (const node of pending) {
        if (distances.has(node) && (current === undefined || distances.get(node)! < distances.get(current)!))
          current = node;
      }
      if (current === undefined) break; // el resto es inalcanzable
      if (current === goal) return { path: this.buildPath(previous, goal), cost: distances.get(goal)! };
      pending.delete(current);

      for (const [next, weight] of this.adjacency.get(current)!) {
        const candidate = distances.get(current)! + weight;
        if (candidate < (distances.get(next) ?? Infinity)) {
          distances.set(next, candidate);
          previous.set(next, current);
        }
      }
    }
    return null;
  }

  private buildPath(previous: Map<T, T | null>, goal: T): T[] {
    const path: T[] = [];
    for (let node: T | null | undefined = goal; node != null; node = previous.get(node)) path.unshift(node);
    return path;
  }
}

// ▶ Demo
export default function demo() {
  // Ciudades y distancias en km
  const map = new Graph<string>()
    .addEdge('Madrid', 'Zaragoza', 315)
    .addEdge('Madrid', 'Valencia', 355)
    .addEdge('Madrid', 'Sevilla', 530)
    .addEdge('Zaragoza', 'Barcelona', 305)
    .addEdge('Valencia', 'Barcelona', 350)
    .addEdge('Sevilla', 'Málaga', 205)
    .addEdge('Valencia', 'Málaga', 625);

  console.log('Vecinos de Madrid:', map.neighbors('Madrid'));

  const fewestStops = map.shortestPathBFS('Sevilla', 'Barcelona');
  console.log('BFS (menos escalas) Sevilla → Barcelona:', fewestStops?.join(' → '));

  const cheapest = map.dijkstra('Málaga', 'Barcelona');
  const route = cheapest?.path.join(' → ');
  console.log(`Dijkstra (menos km) Málaga → Barcelona: ${route} (${cheapest?.cost} km)`);

  console.log('DFS desde Madrid:', map.depthFirst('Madrid'));
}
