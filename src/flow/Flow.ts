export type NodeVariant = 'start' | 'end' | 'operation' | 'inputoutput' | 'input' | 'output' | 'parallel' | 'subroutine' | 'condition';

export type Node<S extends NodeVariant, T> = {
  id: T;
  symbol: NodeVariant;
  label: string;
  options?: any;
  link?: string;
};

export type Endpoint<ID extends string> = ID | `${ID}::${('top' | 'bottom' | 'left' | 'right')}` | `${ID}[${'yes' | 'no' | string}]`;

export type Edge<F extends string, T extends string> = {
  from: Endpoint<F>;
  to: Endpoint<T>[];
}

class Edges<ID extends string> {
  __edges = [] as Edge<any, any>[];

  add<F extends ID, T extends ID>(from: Endpoint<F>, ...to: Endpoint<T>[]) {
    this.__edges.push({ from, to: [...to] });

    return this;
  }
}

export class Flow<ID> {
  __nodes = [] as Node<NodeVariant, unknown>[];
  __edges = new Edges();

  __pathCounts = {} as any;

  edges() {
    return this.__edges as Edges<ID extends string ? ID : never>;
  }

  build() {
    const nodeSection = this.__nodes.map(n => {
      return `${n.id}=>${n.symbol}: ${n.label}`;
    }).join('\n');

    const edgeSection = this.__edges.__edges.map(e => {
      let specialParam = '';
      let from: string, fromSide: string, to: string[], toSide: string[];

      from = e.from.replace(/(\[[^\]]+\](::)?|::).*/, '');
      to = e.to.map(it => it.replace(/::.*/, ''));

      fromSide = e.from.replace(/[^:]+(::)?/, '');
      toSide = e.to.map(it => it.replace(/[^:]*(::)?/, ''));

      const fromNode = this.__nodes.find(it => it.id === from);

      if (fromNode?.symbol === 'parallel') {
        if (!this.__pathCounts[from]) {
          this.__pathCounts[from] = 1;
        }

        specialParam = `path${this.__pathCounts[from]}`;
        this.__pathCounts[from] += 1;
      
      } else if (fromNode?.symbol === 'condition') {
        specialParam = e.from.match(/\[([^\]]+)\]/)[1] ?? '';
      }

      const fromParams = (specialParam || fromSide) ? `(${specialParam}${(specialParam && fromSide) ? ',' : ''}${fromSide})` : '';

      const toParams = (i: number) => toSide[i] ? `(${toSide[i]})` : '';

      return `${[`${from}${fromParams}`, ...to.map((it, i) => `${it}${toParams(i)}`)].join('->')}`;
    }).join('\n');

    const flowchart = `${nodeSection}\n\n${edgeSection}`;
    console.log({ flowchart });

    return flowchart;
  };

  __hasNode(id: any) {
    return !!this.__nodes.find(it => it.id === id);
  }

  __addNode<I extends string>(variant: NodeVariant, id: I, label: string, options?: any) : Flow<ID extends string ? (typeof id | ID) : typeof id> {
    if (!this.__hasNode(id)) {
      this.__nodes.push({ symbol: variant, id, label, options });
    }

    return this as Flow<ID extends string ? (typeof id | ID) : typeof id>;
  }
  
  connect<F extends ID, T extends ID>(from: Endpoint<F extends string ? F : never>, ...to: Endpoint<T extends string ? T : never>[]) {
    this.__edges.add(from, ...to);
    return this;
  }

  start<I extends string>(id: I, label: string, options?: any) {
    return this.__addNode('start', id, label, options);
  }

  end<I extends string>(id: I, label: string, options?: any) {
    return this.__addNode('end', id, label, options);
  }

  cond<I extends string>(id: I, label: string, options?: any) {
    return this.__addNode('condition', id, label, options);
  }

  condition<I extends string>(id: I, label: string, options?: any) {
    return this.__addNode('condition', id, label, options);
  }

  input<I extends string>(id: I, label: string, options?: any) {
    return this.__addNode('input', id, label, options);
  }

  output<I extends string>(id: I, label: string, options?: any) {
    return this.__addNode('output', id, label, options);
  }

  io<I extends string>(id: I, label: string, options?: any) {
    return this.__addNode('inputoutput', id, label, options);
  }

  op<I extends string>(id: I, label: string, options?: any) {
    return this.__addNode('operation', id, label, options);
  }

  operation<I extends string>(id: I, label: string, options?: any) {
    return this.__addNode('operation', id, label, options);
  }

  step<I extends string>(id: I, label: string, options?: any) {
    return this.__addNode('operation', id, label, options);
  }

  para<I extends string>(id: I, label: string, options?: any) {
    return this.__addNode('parallel', id, label, options);
  }

  parallel<I extends string>(id: I, label: string, options?: any) {
    return this.__addNode('parallel', id, label, options);
  }

  sub<I extends string>(id: I, label: string, options?: any) {
    return this.__addNode('subroutine', id, label, options);
  }

  subroutine<I extends string>(id: I, label: string, options?: any) {
    return this.__addNode('subroutine', id, label, options);
  }
}
