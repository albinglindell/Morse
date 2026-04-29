import { CODE_TO_LETTER, textToMorse } from '../morse/tree'

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
  const messageMorse = textToMorse(typedText)

  return (
    <div className="flex w-full flex-col gap-2 rounded-xl border border-board-edge bg-board-elev/80 p-2">
      <div className="flex items-stretch gap-2">
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
          {typedText ? (
            <span className="copyable truncate font-mono text-base tracking-[0.2em] text-trace-soft sm:text-lg">
              {typedText}
            </span>
          ) : (
            <span className="truncate text-muted/50 italic">
              decoded message…
            </span>
          )}
        </div>
      </div>
      <div className="overflow-hidden rounded-lg bg-bg/60 px-3 py-1.5">
        {messageMorse ? (
          <div className="copyable truncate font-mono text-xs tracking-[0.15em] text-muted sm:text-sm">
            {messageMorse}
          </div>
        ) : (
          <div className="truncate text-xs italic text-muted/50 sm:text-sm">
            morse code…
          </div>
        )}
      </div>
    </div>
  )
}

export default OutputDisplayPresenter
