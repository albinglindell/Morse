import { useEffect, useRef, useState } from 'react'

const LONG_PRESS_THRESHOLD_MS = 250

type InputControlsPresenterProps = {
  onSymbol: (symbol: '.' | '-') => void
  onCommitLetter: () => void
  onSpace: () => void
  onBackspace: () => void
  onReset: () => void
}

type ActionChipProps = {
  label: string
  ariaLabel: string
  variant?: 'neutral' | 'primary' | 'danger'
  onClick: () => void
}

const ActionChip = ({
  label,
  ariaLabel,
  variant = 'neutral',
  onClick,
}: ActionChipProps) => {
  const variantClass =
    variant === 'primary'
      ? 'border-trace/60 bg-trace/15 text-trace-soft active:bg-trace/30'
      : variant === 'danger'
        ? 'border-rose-500/60 bg-rose-500/10 text-rose-300 active:bg-rose-500/25'
        : 'border-board-edge bg-board-elev text-trace active:bg-bg-elev'
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      tabIndex={0}
      className={[
        'flex h-11 items-center justify-center rounded-xl border text-sm font-medium tracking-wide transition-colors',
        variantClass,
      ].join(' ')}
      onClick={onClick}
    >
      {label}
    </button>
  )
}

const InputControlsPresenter = ({
  onSymbol,
  onCommitLetter,
  onSpace,
  onBackspace,
  onReset,
}: InputControlsPresenterProps) => {
  const pressStartRef = useRef<number | null>(null)
  const [isHolding, setIsHolding] = useState<boolean>(false)
  const [holdElapsedMs, setHoldElapsedMs] = useState<number>(0)
  const rafRef = useRef<number | null>(null)

  const tickHold = () => {
    if (pressStartRef.current == null) return
    setHoldElapsedMs(() => Date.now() - (pressStartRef.current ?? 0))
    rafRef.current = requestAnimationFrame(tickHold)
  }

  const onPressStartHandler = () => {
    if (pressStartRef.current != null) return
    pressStartRef.current = Date.now()
    setIsHolding(() => true)
    setHoldElapsedMs(() => 0)
    rafRef.current = requestAnimationFrame(tickHold)
  }

  const onPressEndHandler = () => {
    if (pressStartRef.current == null) return
    const duration = Date.now() - pressStartRef.current
    pressStartRef.current = null
    setIsHolding(() => false)
    setHoldElapsedMs(() => 0)
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
    if (duration >= LONG_PRESS_THRESHOLD_MS) {
      onSymbol('-')
      return
    }
    onSymbol('.')
  }

  useEffect(() => {
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  useEffect(() => {
    const onKeyDownHandler = (event: KeyboardEvent) => {
      if (event.repeat) return
      if (event.code === 'Space') {
        event.preventDefault()
        onPressStartHandler()
      }
    }
    const onKeyUpHandler = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        event.preventDefault()
        onPressEndHandler()
      }
    }
    window.addEventListener('keydown', onKeyDownHandler)
    window.addEventListener('keyup', onKeyUpHandler)
    return () => {
      window.removeEventListener('keydown', onKeyDownHandler)
      window.removeEventListener('keyup', onKeyUpHandler)
    }
  })

  const willBeDash = isHolding && holdElapsedMs >= LONG_PRESS_THRESHOLD_MS
  const progress = Math.min(holdElapsedMs / LONG_PRESS_THRESHOLD_MS, 1)

  return (
    <div className="flex w-full flex-col gap-2">
      <button
        type="button"
        aria-label="Press for dot, hold for dash"
        className={[
          'relative flex h-20 w-full select-none touch-none flex-col items-center justify-center overflow-hidden rounded-xl border text-lg font-bold uppercase tracking-[0.2em] transition-colors duration-100 sm:h-24',
          isHolding
            ? willBeDash
              ? 'border-warn bg-warn text-slate-900'
              : 'border-trace bg-trace text-slate-900'
            : 'border-board-edge bg-board-elev text-trace active:bg-board',
        ].join(' ')}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId)
          onPressStartHandler()
        }}
        onPointerUp={onPressEndHandler}
        onPointerCancel={onPressEndHandler}
        onContextMenu={(event) => event.preventDefault()}
      >
        <span className="leading-none">
          {isHolding ? (willBeDash ? 'DASH —' : 'HOLD…') : 'TAP / HOLD'}
        </span>
        <span className="mt-1 text-[10px] font-medium tracking-wider opacity-70 sm:text-xs">
          tap = dot · hold = dash · or Space
        </span>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 h-1 bg-warn"
          style={{
            width: `${progress * 100}%`,
            opacity: isHolding ? 1 : 0,
            transition: 'opacity 120ms',
          }}
        />
      </button>

      <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
        <ActionChip
          label="⏎ letter"
          ariaLabel="Commit current letter"
          variant="primary"
          onClick={onCommitLetter}
        />
        <ActionChip
          label="␣ space"
          ariaLabel="Add space"
          onClick={onSpace}
        />
        <ActionChip
          label="⌫ back"
          ariaLabel="Backspace"
          onClick={onBackspace}
        />
      </div>

      <button
        type="button"
        aria-label="Reset everything"
        tabIndex={0}
        className="flex h-9 w-full items-center justify-center rounded-xl border border-rose-500/40 bg-rose-500/5 text-xs font-medium tracking-[0.25em] text-rose-300 transition-colors active:bg-rose-500/20"
        onClick={onReset}
      >
        ⟲ RESET
      </button>
    </div>
  )
}

export default InputControlsPresenter
