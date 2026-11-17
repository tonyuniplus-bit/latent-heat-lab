import { useEffect, useRef, useState } from "react";
import { EXPERIMENTS, say, type Experiment, type Locale } from "../lab/script";
import { useRamp } from "../lab/ramp";
import { DrawNotes } from "./DrawNotes";
import { FusionRig } from "./FusionRig";
import { VaporRig } from "./VaporRig";

function waitFor(which: Experiment["id"], next: number): number {
  if (which === "fusion") {
    if (next === 2) return 4500;
    if (next === 3) return 4600;
    if (next === 4) return 8000;
    if (next === 5) return 4500;
    return 900;
  }
  if (next === 2) return 4200;
  if (next === 3) return 4600;
  if (next === 4) return 4500;
  if (next === 5) return 9200;
  return 900;
}

export function LabSim() {
  const [locale, setLocale] = useState<Locale>("en");
  const [id, setId] = useState<Experiment["id"]>("fusion");
  const [step, setStep] = useState(0);
  const [fault, setFault] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);
  const ticket = useRef(0);
  const experiment = EXPERIMENTS.find((item) => item.id === id) ?? EXPERIMENTS[0];
  const total = experiment.steps.length;
  const current = step > 0 ? experiment.steps[step - 1] : null;
  const zh = locale === "zh-Hant";

  const fusionPhase = id !== "fusion" || step < 4 ? "hide" : step === 4 ? "run" : "done";
  const joules = useRamp(fusionPhase, 23876, 40896, 7000);
  const vaporPhase = id !== "vapor" || step < 4 ? "hide" : step === 5 ? "run" : "done";
  const balance = useRamp(vaporPhase, 652.1, step >= 5 ? 627.3 : 652.1, 8000);
  const seconds = useRamp(vaporPhase, 0, step >= 5 ? 120 : 0, 8000);
  const coldJoules = useRamp(fault === "cold" ? "run" : "hide", 40896, 51000, 5000);
  const backBalance = useRamp(fault === "back" || fault === "lid" ? "run" : "hide", 627.3, 649.2, 4000);
  const jumpBalance = useRamp(fault === "jump" ? "run" : "hide", 627.3, 598, 4000);
  const fusionLive =
    id === "fusion" && ((step === 4 && joules < 40896) || (fault === "cold" && coldJoules < 51000));

  useEffect(() => {
    document.documentElement.lang = zh ? "zh-Hant" : "en";
    document.title = zh ? "潛熱實驗" : "Latent heat laboratory";
  }, [zh]);

  function choose(next: Experiment["id"]) {
    ticket.current += 1;
    busyRef.current = false;
    setBusy(false);
    setId(next);
    setStep(0);
    setFault(null);
  }

  function hold(which: Experiment["id"], next: number) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      busyRef.current = false;
      setBusy(false);
      return;
    }
    const mine = ++ticket.current;
    busyRef.current = true;
    setBusy(true);
    window.setTimeout(() => {
      if (ticket.current !== mine) return;
      busyRef.current = false;
      setBusy(false);
    }, waitFor(which, next));
  }

  function forward() {
    if (busyRef.current) return;
    const next = step >= total ? 0 : step + 1;
    setFault(null);
    setStep(next);
    if (next === 0) {
      ticket.current += 1;
      busyRef.current = false;
      setBusy(false);
      return;
    }
    hold(id, next);
  }

  function back() {
    if (busyRef.current || step === 0) return;
    const next = step - 1;
    setFault(null);
    setStep(next);
    if (next === 0) {
      ticket.current += 1;
      busyRef.current = false;
      setBusy(false);
      return;
    }
    hold(id, next);
  }

  const seen = current?.see ?? [];

  return (
    <div className="lab">
      <header className="topbar">
        <div>
          <p className="kicker">{zh ? "正式實驗模擬" : "Formal laboratory simulation"}</p>
          <h1>{zh ? "潛熱實驗" : "Latent heat laboratory"}</h1>
        </div>
        <div className="switch" role="group" aria-label={zh ? "實驗" : "Experiment"}>
          {EXPERIMENTS.map((item) => (
            <button
              key={item.id}
              type="button"
              data-testid={`lab-${item.id}`}
              aria-pressed={item.id === id}
              disabled={busy}
              onClick={() => choose(item.id)}
            >
              {say(item.name, locale)}
            </button>
          ))}
        </div>
        <div className="switch" role="group" aria-label={zh ? "語言" : "Language"}>
          <button type="button" aria-pressed={locale === "en"} onClick={() => setLocale("en")}>
            EN
          </button>
          <button type="button" aria-pressed={locale === "zh-Hant"} onClick={() => setLocale("zh-Hant")}>
            繁
          </button>
        </div>
      </header>

      <div className="stage">
        <section className="figure">
          <p className="caption">
            {step === 0
              ? zh
                ? "你站在實驗桌前。按「繼續」才開始。"
                : "You are at the bench. Press Continue to begin."
              : say(current?.title ?? experiment.name, locale)}
          </p>
          <div className="scene-fit">
            {id === "fusion" ? (
              <FusionRig
                step={step}
                joules={fault === "cold" ? coldJoules : step >= 4 ? joules : null}
                powered={fusionLive}
                locale={locale}
                fault={fault}
              />
            ) : (
              <VaporRig
                step={step}
                balance={
                  fault === "back" || fault === "lid" ? backBalance : fault === "jump" ? jumpBalance : step >= 4 ? balance : null
                }
                seconds={step >= 4 ? seconds : null}
                locale={locale}
                fault={fault}
              />
            )}
          </div>
        </section>

        <aside className="panel">
          <div className="panel-body">
            <p className="aim">{say(experiment.aim, locale)}</p>
            {current ? (
              <>
                <p className="progress" data-testid="lab-progress">
                  {zh ? `第 ${step} 步，共 ${total} 步` : `Step ${step} of ${total}`}
                </p>
                <h2 data-testid="lab-title">{say(current.title, locale)}</h2>
                <ul className="points" data-testid="lab-action">
                  <li>{say(current.action, locale)}</li>
                  {current.cautions.map((item) => (
                    <li key={item.en}>{say(item, locale)}</li>
                  ))}
                </ul>
                {current.kind === "deviations" ? (
                  <div data-testid="lab-deviations">
                    <h3>{zh ? "偏差" : "Deviations"}</h3>
                    <ul className="deviations">
                      {experiment.deviations.map((item) => (
                        <li key={item.id} className={fault === item.id ? "is-on" : ""}>
                          <div>
                            <strong>{say(item.title, locale)}</strong>
                            <p>{say(item.why, locale)}</p>
                            <button
                              type="button"
                              data-testid={`fault-${item.id}`}
                              aria-pressed={fault === item.id}
                              onClick={() => setFault(fault === item.id ? null : item.id)}
                            >
                              {fault === item.id ? (zh ? "收回" : "Hide") : zh ? "看看" : "Show"}
                            </button>
                          </div>
                          <span className={`effect is-${item.effect}`}>
                            {item.effect === "high"
                              ? zh
                                ? "偏大"
                                : "Too high"
                              : zh
                                ? "偏小"
                                : "Too low"}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {seen.length > 0 && (
                  <div className="readings" data-testid="lab-readings">
                    {seen.map((item) => (
                      <span key={item.en}>{say(item, locale)}</span>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <p className="ready">
                {zh ? "按「繼續」。注意事項會在裝置上出現。" : "Press Continue. Cautions show on the apparatus."}
              </p>
            )}
          </div>
          <div className="nav">
            <button type="button" onClick={back} disabled={busy || step === 0}>
              {zh ? "上一步" : "Previous"}
            </button>
            <button type="button" data-testid="lab-continue" onClick={forward} disabled={busy}>
              {busy
                ? zh
                  ? "請看完"
                  : "Watching…"
                : step >= total
                  ? zh
                    ? "再做一次"
                    : "Start again"
                  : zh
                    ? "繼續"
                    : "Continue"}
            </button>
          </div>
        </aside>
      </div>
      <DrawNotes locale={locale} />
    </div>
  );
}
