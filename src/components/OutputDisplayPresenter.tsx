import { CODE_TO_LETTER } from '../morse/tree'

type OutputDisplayPresenterProps = {
  currentCode: string
  typedText: string
}

const OutputDisplayPresenter = ({
  currentCode,
  typedText,
}: OutputDisplayPresenterProps) => {
  const previewLetter =
    currentCode === '' ? '' : (CODE_TO_LETTER[currentCode] ?? '?')
  const isUnknown = previewLetter === '?'

  return (
    <div className="flex w-full items-stretch gap-2 rounded-xl border border-board-edge bg-board-elev/80 p-2 shadow-inner">
      <div className="flex min-w-[5.5rem] items-center gap-2 rounded-lg bg-bg/60 px-3 py-1.5">
        <span className="font-mono text-base tracking-[0.25em] text-trace sm:text-lg">
          {currentCode || '·'}
        </span>
        <span className="text-muted">→</span>
        <span
          className={[
            'text-2xl font-bold leading-none sm:text-3xl',
            previewLetter === ''
              ? 'text-muted/40'
              : isUnknown
                ? 'text-rose-400'
                : 'text-warn',
          ].join(' ')}
        >
          {previewLetter || '·'}
        </span>
      </div>
      <div className="flex min-w-0 flex-1 items-center overflow-hidden">
        <span className="truncate font-mono text-base tracking-[0.2em] text-trace-soft sm:text-lg">
          {typedText || (
            <span className="text-muted/50 italic tracking-normal">
              decoded message…
            </span>
          )}
        </span>
      </div>
    </div>
  )
}

export default OutputDisplayPresenter
