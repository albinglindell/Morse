import { useCallback, useState } from "react";
import MorseTreePresenter from "./components/MorseTreePresenter";
import InputControlsPresenter from "./components/InputControlsPresenter";
import OutputDisplayPresenter from "./components/OutputDisplayPresenter";
import { CODE_TO_LETTER } from "./morse/tree";

type MorseSymbol = "." | "-";

const App = () => {
  const [currentCode, setCurrentCode] = useState<string>("");
  const [typedText, setTypedText] = useState<string>("");

  const onSymbolHandler = useCallback((symbol: MorseSymbol) => {
    setCurrentCode((previous) => {
      const next = previous + symbol;
      return next.length > 4 ? previous : next;
    });
  }, []);

  const onCommitLetterHandler = useCallback(() => {
    if (currentCode === "") return;
    const letter = CODE_TO_LETTER[currentCode] ?? "?";
    setTypedText((previousText) => previousText + letter);
    setCurrentCode(() => "");
  }, [currentCode]);

  const onSpaceHandler = useCallback(() => {
    if (currentCode !== "") {
      const letter = CODE_TO_LETTER[currentCode] ?? "?";
      setTypedText((previousText) => previousText + letter + " ");
      setCurrentCode(() => "");
      return;
    }
    setTypedText((previousText) => previousText + " ");
  }, [currentCode]);

  const onBackspaceHandler = useCallback(() => {
    if (currentCode !== "") {
      setCurrentCode((previousCode) => previousCode.slice(0, -1));
      return;
    }
    setTypedText((previousText) => previousText.slice(0, -1));
  }, [currentCode]);

  const onResetHandler = useCallback(() => {
    setCurrentCode(() => "");
    setTypedText(() => "");
  }, []);

  return (
    <div className="mx-auto flex h-[100dvh] w-full max-w-7xl flex-col gap-2 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-[max(0.5rem,env(safe-area-inset-top))] sm:gap-3 sm:px-6 sm:pt-4">
      <header className="flex shrink-0 items-baseline justify-between">
        <span className="text-[10px] uppercase tracking-[0.3em] text-muted sm:text-xs">
          tap = · &nbsp; hold = —
        </span>
      </header>

      <section className="min-h-0 flex-[3] overflow-hidden">
        <MorseTreePresenter currentCode={currentCode} />
      </section>

      <div className="mx-auto flex w-full max-w-md shrink-0 flex-col gap-2 sm:max-w-lg sm:gap-3">
        <OutputDisplayPresenter
          currentCode={currentCode}
          typedText={typedText}
        />

        <InputControlsPresenter
          onSymbol={onSymbolHandler}
          onCommitLetter={onCommitLetterHandler}
          onSpace={onSpaceHandler}
          onBackspace={onBackspaceHandler}
          onReset={onResetHandler}
        />
      </div>
    </div>
  );
};

export default App;
