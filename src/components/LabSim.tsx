import { useEffect, useState } from "react";
import { EXPERIMENTS, say, type Experiment, type Locale } from "../lab/script";
import { useRamp } from "../lab/ramp";
import { BigIce } from "./BigIce";
import { DrawNotes } from "./DrawNotes";
import { FusionRig } from "./FusionRig";
import { VaporRig } from "./VaporRig";

export function LabSim() {
  const [locale, setLocale] = useState<Locale>("en");
  const [id, setId] = useState<Experiment["id"]>("fusion");
  const [step, setStep] = useState(0);
  const [fault, setFault] = useState<string | null>(null);
  const [page, setPage] = useState<"big-ice" | null>(null);
  const [rush, setRush] = useState(false);
  const experiment = EXPERIMENTS.find((item) => item.id === id) ?? EXPERIMENTS[0];
  const total = experiment.steps.length;
  const current = step > 0 ? experiment.steps[step - 1] : null;
  const zh = locale === "zh-Hant";
  const run = (phase: "hide" | "run" | "done") => (rush && phase === "run" ? "done" : phase);

  const fusionPhase = id !== "fusion" || step < 4 ? "hide" : step === 4 ? "run" : "done";
  const joules = useRamp(run(fusionPhase), 0, 17020, 7000);
  const vaporPhase = id !== "vapor" || step < 4 ? "hide" : step === 5 ? "run" : "done";
  const balance = useRamp(run(vaporPhase), 652.1, step >= 5 ? 627.3 : 652.1, 8000);
  const controlBalance = useRamp(run(vaporPhase), 652.1, step >= 5 ? 651.2 : 652.1, 8000);
  const seconds = useRamp(run(vaporPhase), 0, step >= 5 ? 120 : 0, 8000);
  const coldJoules = useRamp(run(fault === "cold" ? "run" : "hide"), 17020, 27124, 3800);
  const iceTemp = -5 + (5 * Math.min(1, Math.max(0, (coldJoules - 17020) / ((27124 - 17020) * 0.42))));
  const warm = useRamp(run(fault === "warm" ? "run" : "hide"), 0, 1, 3800);
  const waterTemp = 80 + (20 * Math.min(1, warm / 0.42));
  const backBalance = useRamp(run(fault === "back" ? "run" : "hide"), 627.3, 649.2, 4000);
  const jumpBalance = useRamp(run(fault === "jump" ? "run" : "hide"), 627.3, 598, 4000);
  const fusionLive =
    id === "fusion" && ((step === 4 && joules < 17020) || (fault === "cold" && coldJoules < 27124));

  useEffect(() => {
    document.documentElement.lang = zh ? "zh-Hant" : "en";
    document.title = zh ? "潛熱實驗" : "Latent heat laboratory";
  }, [zh]);

  function choose(next: Experiment["id"]) {
    setId(next);
    setStep(0);
    setFault(null);
    setPage(null);
  }

  function forward() {
    setFault(null);
    setStep(step >= total ? 0 : step + 1);
  }

  function back() {
    if (step === 0) return;
    setFault(null);
    setStep(step - 1);
  }

  const seen = current?.see ?? [];
  const bigIce = page === "big-ice" && id === "fusion";

  return (
    <div className="lab" data-rush={rush ? "yes" : "no"}>
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
            {bigIce
              ? zh
                ? "為什麼不用大塊冰"
                : "Why not a big piece of ice"
              : step === 0
                ? zh
                  ? "你站在實驗桌前。按「繼續」才開始。"
                  : "You are at the bench. Press Continue to begin."
                : say(current?.title ?? experiment.name, locale)}
          </p>
          <div className="scene-fit">
            {bigIce ? (
              <BigIce locale={locale} />
            ) : id === "fusion" ? (
              <FusionRig
                step={step}
                joules={fault === "cold" ? coldJoules : joules}
                powered={fusionLive}
                iceTemp={iceTemp}
                locale={locale}
                fault={fault}
              />
            ) : (
              <VaporRig
                step={step}
                balance={
                  fault === "back" ? backBalance : fault === "jump" ? jumpBalance : step >= 4 ? balance : null
                }
                controlBalance={step >= 4 ? controlBalance : null}
                seconds={step >= 5 ? seconds : null}
                waterTemp={waterTemp}
                locale={locale}
                fault={fault}
              />
            )}
          </div>
        </section>

        <aside className="panel">
          <div className="panel-body">
            {bigIce ? (
              <>
                <h2>{zh ? "和加熱器的接觸" : "Contact with the heater"}</h2>
                <ul className="points" data-testid="lab-big-ice-why">
                  <li>{zh ? "橙色是冰貼着加熱器的地方。" : "Orange is where the ice touches the heater."}</li>
                  <li>{zh ? "一大塊只貼着一小塊。" : "One big piece touches it in a single small patch."}</li>
                  <li>
                    {zh ? "碎冰四周都貼着，接觸面積較大。" : "Crushed ice touches it all round, so the contact area is larger."}
                  </li>
                  <li>{zh ? "熱只能從接觸的地方傳進冰。" : "Heat enters the ice only through that contact."}</li>
                </ul>
              </>
            ) : (
              <p className="aim">{say(experiment.aim, locale)}</p>
            )}
            {!bigIce && current ? (
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
                      {experiment.deviations.map((item) => {
                        const open = fault === item.id;
                        return (
                          <li key={item.id} className={open ? "is-on" : ""}>
                            <div className="case">
                              <strong>{say(item.title, locale)}</strong>
                              {open ? <p>{say(item.why, locale)}</p> : null}
                            </div>
                            {open ? (
                              <span className={`effect is-${item.effect}`}>
                                {item.effect === "high" ? (zh ? "偏大" : "Too high") : zh ? "偏小" : "Too low"}
                              </span>
                            ) : null}
                            <button
                              type="button"
                              data-testid={`fault-${item.id}`}
                              aria-pressed={open}
                              onClick={() => setFault(open ? null : item.id)}
                            >
                              {open ? (zh ? "收回" : "Hide") : zh ? "看看" : "Show"}
                            </button>
                          </li>
                        );
                      })}
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
            ) : !bigIce ? (
              <p className="ready">
                {zh ? "按「繼續」。注意事項會在裝置上出現。" : "Press Continue. Cautions show on the apparatus."}
              </p>
            ) : null}
          </div>
          <div className="nav">
            {bigIce ? (
              <button type="button" className="is-primary" data-testid="lab-big-ice-back" onClick={() => setPage(null)}>
                {zh ? "回到實驗" : "Back to the experiment"}
              </button>
            ) : (
              <button type="button" onClick={back} disabled={step === 0}>
                {zh ? "上一步" : "Previous"}
              </button>
            )}
            {!bigIce && (
              <button
                type="button"
                data-testid="lab-skip"
                aria-pressed={rush}
                onClick={() => setRush((on) => !on)}
              >
                {rush ? (zh ? "播放" : "Play") : zh ? "跳過" : "Skip"}
              </button>
            )}
            {id === "fusion" && step === 2 && !bigIce ? (
              <button type="button" data-testid="lab-big-ice" onClick={() => setPage("big-ice")}>
                {zh ? "為什麼不用大塊冰" : "Why not big ice?"}
              </button>
            ) : null}
            {!bigIce && (
              <button type="button" data-testid="lab-continue" onClick={forward}>
                {step >= total
                  ? zh
                    ? "再做一次"
                    : "Start again"
                  : zh
                    ? "繼續"
                    : "Continue"}
              </button>
            )}
          </div>
        </aside>
      </div>
      <DrawNotes locale={locale} />
    </div>
  );
}
