import { useState, useMemo, useCallback } from 'react';
import { Category } from '../types';

interface TreeNode {
  category: Category;
  children: TreeNode[];
}

function buildTree(categories: Category[]): TreeNode[] {
  const map = new Map<string, TreeNode>();
  const roots: TreeNode[] = [];

  for (const cat of categories) {
    map.set(cat.id, { category: cat, children: [] });
  }

  for (const cat of categories) {
    const node = map.get(cat.id)!;
    if (cat.parent_id && map.has(cat.parent_id)) {
      map.get(cat.parent_id)!.children.push(node);
    } else {
      roots.push(node);
    }
  }

  function sort(nodes: TreeNode[]) {
    nodes.sort((a, b) => a.category.name.localeCompare(b.category.name));
    nodes.forEach(n => sort(n.children));
  }
  sort(roots);

  return roots;
}

function collectVisible(nodes: TreeNode[], query: string): Set<string> {
  const visible = new Set<string>();
  const q = query.toLowerCase();

  function traverse(node: TreeNode): boolean {
    const selfMatch = node.category.name.toLowerCase().includes(q);
    let anyChildMatch = false;
    for (const child of node.children) {
      if (traverse(child)) anyChildMatch = true;
    }
    if (selfMatch || anyChildMatch) visible.add(node.category.id);
    return selfMatch || anyChildMatch;
  }

  nodes.forEach(traverse);
  return visible;
}

interface NodeProps {
  node: TreeNode;
  selected: Category | null;
  onSelect: (cat: Category) => void;
  expanded: Set<string>;
  onToggle: (id: string) => void;
  query: string;
  visible: Set<string> | null;
}

function TreeNodeItem({ node, selected, onSelect, expanded, onToggle, query, visible }: NodeProps) {
  if (visible && !visible.has(node.category.id)) return null;

  const cat = node.category;
  const isSelected = selected?.id === cat.id;
  const hasChildren = node.children.length > 0;
  const isExpanded = query ? true : expanded.has(cat.id);

  function highlightText(text: string) {
    if (!query) return <>{text}</>;
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return <>{text}</>;
    return (
      <>
        {text.slice(0, idx)}
        <mark className="tree-highlight">{text.slice(idx, idx + query.length)}</mark>
        {text.slice(idx + query.length)}
      </>
    );
  }

  return (
    <div className="tree-node">
      <div
        className={`tree-row${isSelected ? ' tree-row--selected' : ''}`}
        onClick={() => onSelect(cat)}
        title={cat.name}
      >
        <button
          className="tree-toggle"
          onClick={hasChildren ? (e) => { e.stopPropagation(); onToggle(cat.id); } : undefined}
          tabIndex={-1}
          style={{ cursor: hasChildren ? 'pointer' : 'default' }}
        >
          {hasChildren ? (isExpanded ? '▾' : '▸') : null}
        </button>

        <span className={`tree-icon ${hasChildren ? 'tree-icon--branch' : 'tree-icon--leaf'}`}>
          {hasChildren ? '◆' : '●'}
        </span>

        <span className="tree-label">{highlightText(cat.name)}</span>

        {isSelected && <span className="tree-selected-dot" />}
      </div>

      {hasChildren && isExpanded && (
        <div className="tree-children">
          {node.children.map(child => (
            <TreeNodeItem
              key={child.category.id}
              node={child}
              selected={selected}
              onSelect={onSelect}
              expanded={expanded}
              onToggle={onToggle}
              query={query}
              visible={visible}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface Props {
  categories: Category[];
  selected: Category | null;
  onSelect: (cat: Category) => void;
}

export default function CategoryTree({ categories, selected, onSelect }: Props) {
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const tree = useMemo(() => buildTree(categories), [categories]);

  const visible = useMemo(
    () => (query ? collectVisible(tree, query) : null),
    [tree, query]
  );

  const toggle = useCallback((id: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  return (
    <div className="category-tree">
      <div className="tree-search-bar">
        <span className="tree-search-icon">⌕</span>
        <input
          type="text"
          className="tree-search-input"
          placeholder="Buscar categoría..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        {query && (
          <button className="tree-search-clear" onClick={() => setQuery('')} title="Limpiar">✕</button>
        )}
      </div>

      <div className="tree-list">
        {tree.length === 0 ? (
          <p className="tree-empty">No hay categorías</p>
        ) : visible && visible.size === 0 ? (
          <p className="tree-empty">Sin resultados para «{query}»</p>
        ) : (
          tree.map(node => (
            <TreeNodeItem
              key={node.category.id}
              node={node}
              selected={selected}
              onSelect={onSelect}
              expanded={expanded}
              onToggle={toggle}
              query={query}
              visible={visible}
            />
          ))
        )}
      </div>
    </div>
  );
}
