import { useMemo } from 'react'
import {
  MORSE_NODES,
  ROOT_POSITION,
  getNodeByCode,
  getParentCode,
  getPathCodes,
  type MorseNode,
} from '../morse/tree'

type MorseTreePresenterProps = {
  currentCode: string
}

type Edge = {
  fromX: number
  fromY: number
  toX: number
  toY: number
  symbol: '.' | '-'
  childCode: string
}

const UNIT_X = 120
const UNIT_Y = 110
const PADDING_X = 80
const PADDING_Y = 90
const NODE_RADIUS = 26
const DOT_RADIUS = 8
const DASH_W = 34
const DASH_H = 14

const computeEdges = (): Edge[] => {
  const edges: Edge[] = []
  for (const node of MORSE_NODES) {
    const parentCode = getParentCode(node.code)
    const parent =
      parentCode === ''
        ? { position: ROOT_POSITION }
        : getNodeByCode(parentCode)
    if (!parent) continue
    const lastSymbol = node.code[node.code.length - 1] as '.' | '-'
    edges.push({
      fromX: parent.position.x,
      fromY: parent.position.y,
      toX: node.position.x,
      toY: node.position.y,
      symbol: lastSymbol,
      childCode: node.code,
    })
  }
  return edges
}

const toSvgX = (x: number, offsetX: number) => x * UNIT_X + offsetX
const toSvgY = (y: number, offsetY: number) => y * UNIT_Y + offsetY

const MorseTreePresenter = ({ currentCode }: MorseTreePresenterProps) => {
  const edges = useMemo(() => computeEdges(), [])

  const { minX, maxX, minY, maxY } = useMemo(() => {
    const allXs = [ROOT_POSITION.x, ...MORSE_NODES.map((n) => n.position.x)]
    const allYs = [ROOT_POSITION.y, ...MORSE_NODES.map((n) => n.position.y)]
    return {
      minX: Math.min(...allXs),
      maxX: Math.max(...allXs),
      minY: Math.min(...allYs),
      maxY: Math.max(...allYs),
    }
  }, [])

  const offsetX = -minX * UNIT_X + PADDING_X
  const offsetY = -minY * UNIT_Y + PADDING_Y
  const width = (maxX - minX) * UNIT_X + PADDING_X * 2
  const height = (maxY - minY) * UNIT_Y + PADDING_Y * 2

  const activePath = useMemo(() => new Set(getPathCodes(currentCode)), [
    currentCode,
  ])

  const isEdgeActive = (edge: Edge) => activePath.has(edge.childCode)
  const isNodeActive = (node: MorseNode) => activePath.has(node.code)
  const isCurrentNode = (node: MorseNode) =>
    currentCode !== '' && node.code === currentCode

  return (
    <div className="relative flex h-full w-full items-center justify-center rounded-2xl border border-board-edge bg-board p-2 shadow-2xl sm:p-4">
      <div className="pointer-events-none absolute left-3 top-2 select-none text-[10px] font-bold tracking-[0.4em] text-trace/80 sm:left-4 sm:top-4 sm:text-sm">
        MORSE
      </div>
      <div className="pointer-events-none absolute right-3 top-2 select-none text-[10px] font-bold tracking-[0.4em] text-trace/80 sm:right-4 sm:top-4 sm:text-sm">
        CODE
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        className="block h-full max-h-full w-full max-w-full"
      >
        <line
          x1={toSvgX(ROOT_POSITION.x, offsetX)}
          y1={toSvgY(ROOT_POSITION.y, offsetY) - 38}
          x2={toSvgX(ROOT_POSITION.x, offsetX)}
          y2={toSvgY(ROOT_POSITION.y, offsetY) - 8}
          stroke="#6b8a72"
          strokeWidth={2}
        />
        <circle
          cx={toSvgX(ROOT_POSITION.x, offsetX)}
          cy={toSvgY(ROOT_POSITION.y, offsetY) - 44}
          r={7}
          fill="none"
          stroke="#6b8a72"
          strokeWidth={2}
        />

        {edges.map((edge) => {
          const x1 = toSvgX(edge.fromX, offsetX)
          const y1 = toSvgY(edge.fromY, offsetY)
          const x2 = toSvgX(edge.toX, offsetX)
          const y2 = toSvgY(edge.toY, offsetY)
          const active = isEdgeActive(edge)
          return (
            <line
              key={`edge-${edge.childCode}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={active ? '#4ade80' : '#3a5a3f'}
              strokeWidth={active ? 3 : 2}
              strokeLinecap="round"
            />
          )
        })}

        {edges.map((edge) => {
          const midX = (toSvgX(edge.fromX, offsetX) + toSvgX(edge.toX, offsetX)) / 2
          const midY = (toSvgY(edge.fromY, offsetY) + toSvgY(edge.toY, offsetY)) / 2
          const active = isEdgeActive(edge)
          const isHorizontalEdge = edge.fromY === edge.toY
          if (edge.symbol === '.') {
            return (
              <circle
                key={`sym-${edge.childCode}`}
                cx={midX}
                cy={midY}
                r={DOT_RADIUS}
                fill={active ? '#4ade80' : '#1a2b1e'}
                stroke={active ? '#4ade80' : '#3a5a3f'}
                strokeWidth={2}
              />
            )
          }
          const dashW = isHorizontalEdge ? DASH_W : DASH_H
          const dashH = isHorizontalEdge ? DASH_H : DASH_W
          return (
            <rect
              key={`sym-${edge.childCode}`}
              x={midX - dashW / 2}
              y={midY - dashH / 2}
              width={dashW}
              height={dashH}
              rx={2}
              fill={active ? '#4ade80' : '#1a2b1e'}
              stroke={active ? '#4ade80' : '#3a5a3f'}
              strokeWidth={2}
            />
          )
        })}

        {MORSE_NODES.map((node) => {
          const cx = toSvgX(node.position.x, offsetX)
          const cy = toSvgY(node.position.y, offsetY)
          const active = isNodeActive(node)
          const current = isCurrentNode(node)
          const fill = current
            ? '#facc15'
            : active
              ? '#4ade80'
              : '#1a2b1e'
          const stroke = current ? '#facc15' : active ? '#4ade80' : '#3a5a3f'
          return (
            <g key={node.letter}>
              <circle
                cx={cx}
                cy={cy}
                r={NODE_RADIUS}
                fill={fill}
                stroke={stroke}
                strokeWidth={2}
              />
              <text
                x={cx}
                y={cy + 7}
                textAnchor="middle"
                fontSize={22}
                fontWeight={700}
                fill={current ? '#0a100c' : active ? '#0a100c' : '#c0c8bd'}
                style={{ userSelect: 'none' }}
              >
                {node.letter}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export default MorseTreePresenter
