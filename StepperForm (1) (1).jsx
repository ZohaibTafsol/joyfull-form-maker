import { useState, useContext, createContext, useCallback, useEffect, useRef } from "react";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

/**
 * @typedef {Object} StepConfig
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {React.ReactNode} content
 * @property {(data: Record<string, any>) => string | null} [validate]
 */

/**
 * @typedef {Object} StepState
 * @property {string} id
 * @property {boolean} completed
 * @property {boolean} visited
 * @property {Record<string, any>} data
 * @property {string | null} error
 */

/**
 * @typedef {Object} StepperContextValue
 * @property {StepConfig[]} steps
 * @property {StepState[]} stepStates
 * @property {number} currentIndex
 * @property {(index: number) => void} goToStep
 * @property {() => void} nextStep
 * @property {() => void} prevStep
 * @property {(id: string, data: Record<string, any>) => void} updateStepData
 * @property {() => boolean} validateCurrentStep
 * @property {(steps: StepConfig[]) => void} setSteps
 * @property {(step: StepConfig) => void} addStep
 * @property {(id: string) => void} removeStep
 * @property {number} completionPercentage
 */

// ─────────────────────────────────────────────
// CONTEXT
// ─────────────────────────────────────────────

const StepperContext = createContext(null);

export function useStepper() {
  const ctx = useContext(StepperContext);
  if (!ctx) throw new Error("useStepper must be used inside StepperProvider");
  return ctx;
}

export function StepperProvider({ initialSteps = [], children }) {
  const [steps, setStepsState] = useState(initialSteps);
  const [stepStates, setStepStates] = useState(() =>
    initialSteps.map((s) => ({ id: s.id, completed: false, visited: false, data: {}, error: null }))
  );
  const [currentIndex, setCurrentIndex] = useState(0);

  const syncStepStates = useCallback((newSteps) => {
    setStepStates((prev) => {
      const map = Object.fromEntries(prev.map((s) => [s.id, s]));
      return newSteps.map((s) => map[s.id] ?? { id: s.id, completed: false, visited: false, data: {}, error: null });
    });
  }, []);

  const setSteps = useCallback((newSteps) => {
    setStepsState(newSteps);
    syncStepStates(newSteps);
    setCurrentIndex(0);
  }, [syncStepStates]);

  const addStep = useCallback((step) => {
    setStepsState((prev) => {
      const next = [...prev, step];
      syncStepStates(next);
      return next;
    });
  }, [syncStepStates]);

  const removeStep = useCallback((id) => {
    setStepsState((prev) => {
      const next = prev.filter((s) => s.id !== id);
      syncStepStates(next);
      return next;
    });
    setCurrentIndex((i) => Math.min(i, steps.length - 2));
  }, [steps.length, syncStepStates]);

  const updateStepData = useCallback((id, data) => {
    setStepStates((prev) =>
      prev.map((s) => (s.id === id ? { ...s, data: { ...s.data, ...data } } : s))
    );
  }, []);

  const validateCurrentStep = useCallback(() => {
    const step = steps[currentIndex];
    const state = stepStates[currentIndex];
    if (!step?.validate) return true;
    const error = step.validate(state?.data ?? {});
    setStepStates((prev) =>
      prev.map((s, i) => (i === currentIndex ? { ...s, error } : s))
    );
    return error === null;
  }, [steps, stepStates, currentIndex]);

  const goToStep = useCallback((index) => {
    if (index < 0 || index >= steps.length) return;
    if (index > currentIndex) return; // can't jump ahead
    const targetState = stepStates[index];
    if (index !== currentIndex && !targetState?.completed && !targetState?.visited) return;
    setCurrentIndex(index);
    setStepStates((prev) =>
      prev.map((s, i) => (i === index ? { ...s, visited: true } : s))
    );
  }, [steps.length, currentIndex, stepStates]);

  const nextStep = useCallback(() => {
    if (!validateCurrentStep()) return;
    setStepStates((prev) =>
      prev.map((s, i) => (i === currentIndex ? { ...s, completed: true, visited: true, error: null } : s))
    );
    if (currentIndex < steps.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setStepStates((prev) =>
        prev.map((s, i) => (i === currentIndex + 1 ? { ...s, visited: true } : s))
      );
    }
  }, [currentIndex, steps.length, validateCurrentStep]);

  const prevStep = useCallback(() => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  }, [currentIndex]);

  const completionPercentage = Math.round(
    (stepStates.filter((s) => s.completed).length / Math.max(steps.length, 1)) * 100
  );

  return (
    <StepperContext.Provider value={{
      steps, stepStates, currentIndex,
      goToStep, nextStep, prevStep,
      updateStepData, validateCurrentStep,
      setSteps, addStep, removeStep,
      completionPercentage,
    }}>
      {children}
    </StepperContext.Provider>
  );
}

// ─────────────────────────────────────────────
// PROGRESS BAR
// ─────────────────────────────────────────────

function ProgressBar() {
  const { completionPercentage } = useStepper();
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      height: 3, background: "#e0e0e0",
    }}>
      <div style={{
        height: "100%",
        width: `${completionPercentage}%`,
        background: "linear-gradient(90deg, #FF385C, #E31C5F)",
        transition: "width 0.5s cubic-bezier(0.4,0,0.2,1)",
        borderRadius: "0 2px 2px 0",
      }} />
    </div>
  );
}

// ─────────────────────────────────────────────
// STEP CONTENT (animated panel)
// ─────────────────────────────────────────────

function StepContent() {
  const { steps, stepStates, currentIndex } = useStepper();
  const prevIndex = useRef(currentIndex);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState("forward");
  const [displayIndex, setDisplayIndex] = useState(currentIndex);

  useEffect(() => {
    if (currentIndex !== prevIndex.current) {
      const dir = currentIndex > prevIndex.current ? "forward" : "backward";
      setDirection(dir);
      setAnimating(true);
      const t = setTimeout(() => {
        setDisplayIndex(currentIndex);
        setAnimating(false);
        prevIndex.current = currentIndex;
      }, 180);
      return () => clearTimeout(t);
    }
  }, [currentIndex]);

  const displayStep = steps[displayIndex];
  const displayState = stepStates[displayIndex];

  const translateOut = animating
    ? direction === "forward" ? "translateX(-40px)" : "translateX(40px)"
    : "translateX(0)";

  return (
    <div style={{
      flex: 1, overflow: "hidden", padding: "40px 0 0",
      display: "flex", flexDirection: "column",
    }}>
      <div style={{
        transform: translateOut,
        opacity: animating ? 0 : 1,
        transition: "transform 0.22s cubic-bezier(0.4,0,0.2,1), opacity 0.22s ease",
        flex: 1, display: "flex", flexDirection: "column",
      }}>
        {/* Step header */}
        <div style={{ marginBottom: 36 }}>
          <p style={{ fontSize: 13, color: "#FF385C", fontWeight: 600, marginBottom: 10, letterSpacing: "0.04em", textTransform: "uppercase" }}>
            Step {displayIndex + 1} of {steps.length}
          </p>
          <h1 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 800, color: "#1a1a1a", margin: 0, letterSpacing: "-0.03em", lineHeight: 1.15 }}>
            {displayStep?.title}
          </h1>
          <p style={{ fontSize: 16, color: "#717171", marginTop: 12, lineHeight: 1.6, maxWidth: 640 }}>
            {displayStep?.description}
          </p>
        </div>

        {/* Content area */}
        <div style={{ flex: 1 }}>
          {displayStep?.content}
        </div>

        {/* Validation error */}
        {displayState?.error && (
          <div style={{
            marginTop: 20, padding: "12px 16px", borderRadius: 10,
            background: "#FFF0F3", border: "1px solid #FFD0DA",
            color: "#C9003D", fontSize: 14, fontWeight: 500, display: "flex", alignItems: "center", gap: 8,
          }}>
            <span>⚠</span> {displayState.error}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// STEP DOT (with tooltip)
// ─────────────────────────────────────────────

function StepDot({ step, index, isMobile }) {
  const { stepStates, currentIndex, goToStep } = useStepper();
  const [hovered, setHovered] = useState(false);
  const state = stepStates[index];
  const isCurrent = index === currentIndex;
  const isCompleted = state?.completed;
  const isClickable = index <= currentIndex || isCompleted;

  return (
    <div
      style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Tooltip */}
      {hovered && (
        <div
          role="tooltip"
          style={{
            position: "absolute",
            bottom: "calc(100% + 10px)",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#222",
            color: "#fff",
            padding: "8px 12px",
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 600,
            whiteSpace: "nowrap",
            maxWidth: isMobile ? 180 : 240,
            overflow: "hidden",
            textOverflow: "ellipsis",
            boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
            pointerEvents: "none",
            zIndex: 10,
            letterSpacing: "-0.01em",
          }}
        >
          {step.title}
          <div style={{
            position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)",
            width: 0, height: 0,
            borderLeft: "5px solid transparent",
            borderRight: "5px solid transparent",
            borderTop: "5px solid #222",
          }} />
        </div>
      )}

      <button
        onClick={() => isClickable && goToStep(index)}
        disabled={!isClickable}
        aria-label={`${step.title}${isCompleted ? " (completed)" : ""}`}
        aria-current={isCurrent ? "step" : undefined}
        style={{
          width: isCurrent ? 28 : 10,
          height: 10,
          borderRadius: 5,
          border: "none",
          padding: 0,
          background: isCurrent ? "#FF385C" : isCompleted ? "#222" : "#ddd",
          cursor: isClickable ? "pointer" : "default",
          transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────
// NAVIGATION CONTROLS (bottom bar: back / dots+tooltips / continue)
// ─────────────────────────────────────────────

function NavigationControls({ isMobile }) {
  const { currentIndex, steps, nextStep, prevStep } = useStepper();
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === steps.length - 1;

  return (
    <div style={{
      display: "flex", flexDirection: "column", gap: isMobile ? 16 : 0,
      borderTop: "1px solid #ebebeb", marginTop: "auto",
      padding: isMobile ? "20px 0" : "24px 0",
    }}>
      {/* Dots row */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        gap: 8, order: isMobile ? -1 : 0,
        paddingBottom: isMobile ? 0 : 20,
      }}>
        {steps.map((step, i) => (
          <StepDot key={step.id} step={step} index={i} isMobile={isMobile} />
        ))}
      </div>

      {/* Buttons row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button
          onClick={prevStep}
          disabled={isFirst}
          style={{
            padding: isMobile ? "12px 20px" : "14px 28px", borderRadius: 12, border: "2px solid #222",
            background: "transparent", color: "#222", fontWeight: 700, fontSize: 15,
            cursor: isFirst ? "not-allowed" : "pointer", opacity: isFirst ? 0.3 : 1,
            transition: "all 0.2s", letterSpacing: "-0.01em",
          }}
        >
          ← Back
        </button>

        <button
          onClick={nextStep}
          style={{
            padding: isMobile ? "12px 20px" : "14px 28px", borderRadius: 12, border: "none",
            background: isLast ? "linear-gradient(135deg, #FF385C, #E31C5F)" : "#222",
            color: "#fff", fontWeight: 700, fontSize: 15,
            cursor: "pointer", transition: "all 0.2s", letterSpacing: "-0.01em",
            boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
          }}
          onMouseEnter={(e) => { e.target.style.transform = "scale(1.03)"; e.target.style.boxShadow = "0 4px 20px rgba(0,0,0,0.22)"; }}
          onMouseLeave={(e) => { e.target.style.transform = "scale(1)"; e.target.style.boxShadow = "0 2px 12px rgba(0,0,0,0.15)"; }}
        >
          {isLast ? "🎉 Submit" : "Continue →"}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// STEPPER CONTAINER (layout)
// ─────────────────────────────────────────────

function StepperContainer() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return (
    <div style={{
      minHeight: "100vh", background: "#fff",
      display: "flex", flexDirection: "column",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    }}>
      <ProgressBar />

      {/* Top bar */}
      <header style={{
        padding: isMobile ? "0 20px" : "0 40px", height: 64,
        borderBottom: "1px solid #ebebeb",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, background: "#fff", zIndex: 50,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: "linear-gradient(135deg, #FF385C, #E31C5F)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ color: "#fff", fontSize: 16 }}>✦</span>
          </div>
          <span style={{ fontWeight: 800, fontSize: 17, color: "#FF385C", letterSpacing: "-0.04em" }}>airform</span>
        </div>
        <CompletionBadge isMobile={isMobile} />
      </header>

      {/* Main content - full width, no sidebar */}
      <div style={{
        display: "flex", flex: 1, flexDirection: "column",
        maxWidth: 880, margin: "0 auto", width: "100%",
        padding: isMobile ? "0 20px" : "0 40px",
        boxSizing: "border-box",
      }}>
        <main style={{
          flex: 1, display: "flex", flexDirection: "column",
          paddingBottom: isMobile ? 16 : 32, minHeight: 0,
        }}>
          <StepContent />
          <NavigationControls isMobile={isMobile} />
        </main>
      </div>
    </div>
  );
}

function CompletionBadge({ isMobile }) {
  const { completionPercentage, stepStates } = useStepper();
  const completed = stepStates.filter((s) => s.completed).length;
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      padding: "6px 14px", borderRadius: 20,
      background: completionPercentage === 100 ? "#F0FFF4" : "#f7f7f7",
      border: `1px solid ${completionPercentage === 100 ? "#BBF7D0" : "#ebebeb"}`,
    }}>
      <div style={{
        width: 32, height: 32, position: "relative",
      }}>
        <svg viewBox="0 0 32 32" style={{ transform: "rotate(-90deg)", width: 32, height: 32 }}>
          <circle cx="16" cy="16" r="13" fill="none" stroke="#e5e5e5" strokeWidth="3" />
          <circle
            cx="16" cy="16" r="13" fill="none"
            stroke={completionPercentage === 100 ? "#22C55E" : "#FF385C"}
            strokeWidth="3"
            strokeDasharray={`${2 * Math.PI * 13}`}
            strokeDashoffset={`${2 * Math.PI * 13 * (1 - completionPercentage / 100)}`}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.5s cubic-bezier(0.4,0,0.2,1)" }}
          />
        </svg>
        <span style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 9, fontWeight: 700, color: "#222",
        }}>
          {completionPercentage}%
        </span>
      </div>
      {!isMobile && (
        <span style={{ fontSize: 13, fontWeight: 600, color: "#444" }}>
          {completed}/{stepStates.length} done
        </span>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// SAMPLE STEP COMPONENTS
// ─────────────────────────────────────────────

function InputField({ label, placeholder, value, onChange, type = "text", hint }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#222", marginBottom: 8 }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%", padding: "14px 16px", border: "2px solid #e5e5e5",
          borderRadius: 12, fontSize: 16, color: "#222", outline: "none",
          transition: "border-color 0.2s", boxSizing: "border-box",
          fontFamily: "inherit",
        }}
        onFocus={(e) => { e.target.style.borderColor = "#FF385C"; }}
        onBlur={(e) => { e.target.style.borderColor = "#e5e5e5"; }}
      />
      {hint && <p style={{ margin: "6px 0 0", fontSize: 13, color: "#888" }}>{hint}</p>}
    </div>
  );
}

function SelectCard({ options, value, onChange, multiple = false }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12, marginTop: 8 }}>
      {options.map((opt) => {
        const selected = multiple ? (value || []).includes(opt.value) : value === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => {
              if (multiple) {
                const cur = value || [];
                onChange(selected ? cur.filter((v) => v !== opt.value) : [...cur, opt.value]);
              } else {
                onChange(opt.value);
              }
            }}
            style={{
              padding: "20px 16px", border: `2px solid ${selected ? "#222" : "#e5e5e5"}`,
              borderRadius: 14, background: selected ? "#f7f7f7" : "#fff",
              cursor: "pointer", textAlign: "center",
              transition: "all 0.2s", boxShadow: selected ? "0 2px 12px rgba(0,0,0,0.08)" : "none",
            }}
          >
            <div style={{ fontSize: 28, marginBottom: 8 }}>{opt.icon}</div>
            <div style={{ fontSize: 14, fontWeight: selected ? 700 : 500, color: "#222" }}>{opt.label}</div>
          </button>
        );
      })}
    </div>
  );
}

function RangeSlider({ label, min, max, step, value, onChange, unit }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <label style={{ fontSize: 14, fontWeight: 600, color: "#222" }}>{label}</label>
        <span style={{ fontSize: 22, fontWeight: 800, color: "#222" }}>{value}{unit}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: "100%", accentColor: "#FF385C", height: 4 }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 12, color: "#aaa" }}>
        <span>{min}{unit}</span><span>{max}{unit}</span>
      </div>
    </div>
  );
}

function Textarea({ label, placeholder, value, onChange, rows = 4 }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#222", marginBottom: 8 }}>{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        style={{
          width: "100%", padding: "14px 16px", border: "2px solid #e5e5e5",
          borderRadius: 12, fontSize: 15, color: "#222", outline: "none", resize: "vertical",
          fontFamily: "inherit", lineHeight: 1.6, boxSizing: "border-box", transition: "border-color 0.2s",
        }}
        onFocus={(e) => { e.target.style.borderColor = "#FF385C"; }}
        onBlur={(e) => { e.target.style.borderColor = "#e5e5e5"; }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────
// STEP DATA HOOK (per-step binding)
// ─────────────────────────────────────────────

function useStepData(stepId, defaults = {}) {
  const { stepStates, updateStepData } = useStepper();
  const state = stepStates.find((s) => s.id === stepId);
  const data = state?.data ?? defaults;
  const update = useCallback((partial) => updateStepData(stepId, partial), [stepId, updateStepData]);
  return [data, update];
}

// ─────────────────────────────────────────────
// 10 SAMPLE STEP CONTENTS
// ─────────────────────────────────────────────

function Step1Content() {
  const [data, update] = useStepData("step-1", { type: "" });
  return (
    <div>
      <SelectCard
        value={data.type}
        onChange={(v) => update({ type: v })}
        options={[
          { value: "house", icon: "🏠", label: "House" },
          { value: "apartment", icon: "🏢", label: "Apartment" },
          { value: "cabin", icon: "🏡", label: "Cabin" },
          { value: "villa", icon: "🌴", label: "Villa" },
          { value: "studio", icon: "🛋️", label: "Studio" },
          { value: "boat", icon: "⛵", label: "Boat" },
        ]}
      />
    </div>
  );
}

function Step2Content() {
  const [data, update] = useStepData("step-2", { privacy: "" });
  return (
    <SelectCard
      value={data.privacy}
      onChange={(v) => update({ privacy: v })}
      options={[
        { value: "entire", icon: "🔑", label: "Entire place" },
        { value: "private", icon: "🚪", label: "Private room" },
        { value: "shared", icon: "🤝", label: "Shared room" },
      ]}
    />
  );
}

function Step3Content() {
  const [data, update] = useStepData("step-3", { guests: 2, bedrooms: 1, beds: 1, bathrooms: 1 });
  return (
    <div style={{ maxWidth: 460 }}>
      {[
        { key: "guests", label: "Guests", min: 1, max: 16, unit: "" },
        { key: "bedrooms", label: "Bedrooms", min: 0, max: 10, unit: "" },
        { key: "beds", label: "Beds", min: 1, max: 20, unit: "" },
        { key: "bathrooms", label: "Bathrooms", min: 1, max: 8, unit: "" },
      ].map(({ key, label, min, max, unit }) => (
        <div key={key} style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "20px 0", borderBottom: "1px solid #f0f0f0",
        }}>
          <div>
            <p style={{ margin: 0, fontWeight: 600, fontSize: 16, color: "#222" }}>{label}</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button onClick={() => update({ [key]: Math.max(min, data[key] - 1) })} style={{
              width: 36, height: 36, borderRadius: "50%", border: "2px solid #ccc",
              background: "#fff", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center",
            }}>−</button>
            <span style={{ fontSize: 18, fontWeight: 700, minWidth: 24, textAlign: "center" }}>{data[key]}</span>
            <button onClick={() => update({ [key]: Math.min(max, data[key] + 1) })} style={{
              width: 36, height: 36, borderRadius: "50%", border: "2px solid #222",
              background: "#fff", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center",
            }}>+</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function Step4Content() {
  const [data, update] = useStepData("step-4", { amenities: [] });
  return (
    <SelectCard
      multiple
      value={data.amenities}
      onChange={(v) => update({ amenities: v })}
      options={[
        { value: "wifi", icon: "📶", label: "WiFi" },
        { value: "kitchen", icon: "🍳", label: "Kitchen" },
        { value: "parking", icon: "🅿️", label: "Parking" },
        { value: "pool", icon: "🏊", label: "Pool" },
        { value: "ac", icon: "❄️", label: "AC" },
        { value: "gym", icon: "💪", label: "Gym" },
        { value: "tv", icon: "📺", label: "TV" },
        { value: "pets", icon: "🐶", label: "Pets OK" },
      ]}
    />
  );
}

function Step5Content() {
  const [data, update] = useStepData("step-5", { title: "", description: "" });
  return (
    <div style={{ maxWidth: 560 }}>
      <InputField
        label="Listing title"
        placeholder="e.g. Cozy loft in the heart of the city"
        value={data.title}
        onChange={(v) => update({ title: v })}
        hint="Make it catchy — this is the first thing guests see."
      />
      <Textarea
        label="Description"
        placeholder="Describe what makes your place special..."
        value={data.description}
        onChange={(v) => update({ description: v })}
        rows={5}
      />
    </div>
  );
}

function Step6Content() {
  const [data, update] = useStepData("step-6", { photos: [] });
  const photos = ["🏡", "🛋️", "🛏️", "🍳", "🚿", "🌅"];
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, maxWidth: 480 }}>
        {photos.map((p, i) => (
          <div
            key={i}
            onClick={() => {
              const cur = data.photos || [];
              const updated = cur.includes(i) ? cur.filter((x) => x !== i) : [...cur, i];
              update({ photos: updated });
            }}
            style={{
              aspectRatio: "4/3", borderRadius: 14, border: `3px solid ${(data.photos || []).includes(i) ? "#222" : "#e5e5e5"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 40, cursor: "pointer", transition: "all 0.2s",
              background: (data.photos || []).includes(i) ? "#f5f5f5" : "#fafafa",
            }}>
            {p}
          </div>
        ))}
      </div>
      <p style={{ marginTop: 16, fontSize: 13, color: "#888" }}>
        {(data.photos || []).length} photo(s) selected — click to toggle
      </p>
    </div>
  );
}

function Step7Content() {
  const [data, update] = useStepData("step-7", { country: "", city: "", address: "" });
  return (
    <div style={{ maxWidth: 560 }}>
      <InputField label="Country" placeholder="e.g. United States" value={data.country} onChange={(v) => update({ country: v })} />
      <InputField label="City" placeholder="e.g. New York" value={data.city} onChange={(v) => update({ city: v })} />
      <InputField label="Street address" placeholder="e.g. 123 Main St" value={data.address} onChange={(v) => update({ address: v })} />
    </div>
  );
}

function Step8Content() {
  const [data, update] = useStepData("step-8", { price: 85, currency: "USD" });
  return (
    <div style={{ maxWidth: 460 }}>
      <div style={{ padding: "32px", border: "2px solid #e5e5e5", borderRadius: 20, marginBottom: 24, textAlign: "center" }}>
        <p style={{ fontSize: 13, color: "#888", margin: "0 0 8px" }}>Your nightly price</p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <span style={{ fontSize: 48, fontWeight: 800, color: "#222" }}>${data.price}</span>
        </div>
        <p style={{ fontSize: 13, color: "#aaa", marginTop: 8 }}>per night before taxes</p>
      </div>
      <RangeSlider label="Adjust price" min={10} max={1000} step={5} value={data.price} onChange={(v) => update({ price: v })} unit=" $" />
    </div>
  );
}

function Step9Content() {
  const [data, update] = useStepData("step-9", { instant: false, minNights: 1, maxNights: 30 });
  return (
    <div style={{ maxWidth: 520 }}>
      <div
        onClick={() => update({ instant: !data.instant })}
        style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "20px", border: `2px solid ${data.instant ? "#222" : "#e5e5e5"}`,
          borderRadius: 16, cursor: "pointer", marginBottom: 24, transition: "border-color 0.2s",
        }}>
        <div>
          <p style={{ fontWeight: 700, fontSize: 16, margin: "0 0 4px" }}>⚡ Instant Book</p>
          <p style={{ fontSize: 14, color: "#717171", margin: 0 }}>Guests can book without waiting for your approval</p>
        </div>
        <div style={{
          width: 48, height: 28, borderRadius: 14, background: data.instant ? "#222" : "#ccc",
          position: "relative", transition: "background 0.3s",
        }}>
          <div style={{
            position: "absolute", top: 4, left: data.instant ? 24 : 4,
            width: 20, height: 20, borderRadius: "50%", background: "#fff",
            transition: "left 0.3s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
          }} />
        </div>
      </div>
      <RangeSlider label="Minimum nights" min={1} max={30} step={1} value={data.minNights} onChange={(v) => update({ minNights: v })} unit=" nights" />
      <RangeSlider label="Maximum nights" min={1} max={365} step={1} value={data.maxNights} onChange={(v) => update({ maxNights: v })} unit=" nights" />
    </div>
  );
}

// ─────────────────────────────────────────────
// PREVIEW LISTING STEP
// ─────────────────────────────────────────────

function PreviewListingContent() {
  const { stepStates } = useStepper();
  const [mode, setMode] = useState("web"); // "web" | "mobile"

  const getData = (id, defaults = {}) => {
    const s = stepStates.find((s) => s.id === id);
    return { ...defaults, ...(s?.data ?? {}) };
  };

  const d1 = getData("step-1", { type: "" });
  const d2 = getData("step-2", { privacy: "" });
  const d3 = getData("step-3", { guests: 2, bedrooms: 1, beds: 1, bathrooms: 1 });
  const d4 = getData("step-4", { amenities: [] });
  const d5 = getData("step-5", { title: "Your listing", description: "" });
  const d6 = getData("step-6", { photos: [] });
  const d7 = getData("step-7", { country: "", city: "", address: "" });
  const d8 = getData("step-8", { price: 85, currency: "USD" });
  const d9 = getData("step-9", { instant: false, minNights: 1, maxNights: 30 });

  const photoEmojis = ["🏡", "🛋️", "🛏️", "🍳", "🚿", "🌅"];
  const selectedPhotos = (d6.photos || []).map((i) => photoEmojis[i]).filter(Boolean);
  const coverPhoto = selectedPhotos[0] || "🏠";

  const amenityIcons = { wifi: "📶", kitchen: "🍳", parking: "🅿️", pool: "🏊", ac: "❄️", gym: "💪", tv: "📺", pets: "🐶" };
  const amenityLabels = { wifi: "WiFi", kitchen: "Kitchen", parking: "Free parking", pool: "Pool", ac: "Air conditioning", gym: "Gym", tv: "TV", pets: "Pets allowed" };
  const typeLabels = { house: "House", apartment: "Apartment", cabin: "Cabin", villa: "Villa", studio: "Studio", boat: "Boat" };
  const privacyLabels = { entire: "Entire place", private: "Private room", shared: "Shared room" };

  const location = [d7.city, d7.country].filter(Boolean).join(", ") || "Location not set";
  const title = d5.title?.trim() || "Your Listing";
  const description = d5.description?.trim() || "No description provided yet.";

  const stars = "★★★★★";

  // ── Web Preview ──────────────────────────────
  const WebPreview = () => (
    <div style={{
      border: "1.5px solid #e5e5e5", borderRadius: 20, overflow: "hidden",
      background: "#fff", boxShadow: "0 8px 40px rgba(0,0,0,0.10)", maxWidth: 780,
    }}>
      {/* Browser chrome */}
      <div style={{
        background: "#f5f5f5", padding: "10px 16px", borderBottom: "1px solid #e0e0e0",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <div style={{ display: "flex", gap: 6 }}>
          {["#FF5F57","#FFBD2E","#28CA41"].map((c,i) => (
            <div key={i} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />
          ))}
        </div>
        <div style={{
          flex: 1, background: "#fff", borderRadius: 6, padding: "4px 12px",
          fontSize: 12, color: "#888", border: "1px solid #e0e0e0", maxWidth: 360, margin: "0 auto",
        }}>
          🔒 airform.com/listing/preview
        </div>
      </div>

      {/* Page content */}
      <div style={{ padding: "0 0 40px" }}>
        {/* Hero photo */}
        <div style={{
          height: 280, background: "linear-gradient(135deg, #f0f0f0, #e8e8e8)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 80, position: "relative", overflow: "hidden",
        }}>
          {coverPhoto}
          {selectedPhotos.length > 1 && (
            <div style={{
              position: "absolute", bottom: 12, right: 14,
              background: "rgba(255,255,255,0.92)", borderRadius: 8, padding: "6px 12px",
              fontSize: 13, fontWeight: 600, color: "#222", border: "1px solid #ddd",
            }}>
              📷 Show all {selectedPhotos.length} photos
            </div>
          )}
          {d9.instant && (
            <div style={{
              position: "absolute", top: 14, left: 14, background: "#222", color: "#fff",
              borderRadius: 20, padding: "4px 10px", fontSize: 12, fontWeight: 700,
            }}>⚡ Instant Book</div>
          )}
        </div>

        <div style={{ padding: "28px 36px", display: "flex", gap: 40 }}>
          {/* Left column */}
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ margin: "0 0 4px", fontSize: 14, color: "#717171" }}>
                  {privacyLabels[d2.privacy] || "Place"} · {typeLabels[d1.type] || "Property"} · {location}
                </p>
                <h2 style={{ margin: "0 0 4px", fontSize: 24, fontWeight: 800, color: "#1a1a1a", letterSpacing: "-0.02em" }}>{title}</h2>
                <p style={{ margin: 0, fontSize: 14, color: "#717171" }}>
                  {d3.guests} guests · {d3.bedrooms} bedroom{d3.bedrooms !== 1 ? "s" : ""} · {d3.beds} bed{d3.beds !== 1 ? "s" : ""} · {d3.bathrooms} bath{d3.bathrooms !== 1 ? "s" : ""}
                </p>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontSize: 14, color: "#FF385C", fontWeight: 700 }}>
                  {stars} <span style={{ color: "#222" }}>5.0</span>
                </div>
                <div style={{ fontSize: 12, color: "#888" }}>New listing</div>
              </div>
            </div>

            <hr style={{ border: "none", borderTop: "1px solid #ebebeb", margin: "24px 0" }} />

            <p style={{ fontSize: 15, color: "#444", lineHeight: 1.7, margin: "0 0 24px" }}>{description}</p>

            {(d4.amenities || []).length > 0 && (
              <>
                <h3 style={{ fontWeight: 700, fontSize: 18, color: "#222", margin: "0 0 16px" }}>What this place offers</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {(d4.amenities || []).map((a) => (
                    <div key={a} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#222" }}>
                      <span style={{ fontSize: 18 }}>{amenityIcons[a]}</span>
                      {amenityLabels[a] || a}
                    </div>
                  ))}
                </div>
              </>
            )}

            <hr style={{ border: "none", borderTop: "1px solid #ebebeb", margin: "24px 0" }} />
            <div style={{ display: "flex", gap: 24, fontSize: 13, color: "#717171" }}>
              <span>📅 Min {d9.minNights} night{d9.minNights !== 1 ? "s" : ""}</span>
              <span>📅 Max {d9.maxNights} nights</span>
              {d7.address && <span>📍 {d7.address}</span>}
            </div>
          </div>

          {/* Booking card */}
          <div style={{ width: 340, flexShrink: 0 }}>
            <div style={{
              border: "1.5px solid #ddd", borderRadius: 16, padding: 24,
              boxShadow: "0 6px 28px rgba(0,0,0,0.10)", position: "sticky", top: 20,
            }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 20 }}>
                <span style={{ fontSize: 26, fontWeight: 800, color: "#222" }}>${d8.price}</span>
                <span style={{ fontSize: 15, color: "#717171" }}>/ night</span>
              </div>
              <div style={{ border: "1.5px solid #222", borderRadius: 10, overflow: "hidden", marginBottom: 12 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "1px solid #ddd" }}>
                  {[["CHECK-IN","Add date"],["CHECKOUT","Add date"]].map(([lbl, val]) => (
                    <div key={lbl} style={{ padding: "12px 14px", borderRight: lbl === "CHECK-IN" ? "1px solid #ddd" : "none" }}>
                      <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: "#222" }}>{lbl}</p>
                      <p style={{ margin: 0, fontSize: 13, color: "#888" }}>{val}</p>
                    </div>
                  ))}
                </div>
                <div style={{ padding: "12px 14px" }}>
                  <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: "#222" }}>GUESTS</p>
                  <p style={{ margin: 0, fontSize: 13, color: "#888" }}>1 guest</p>
                </div>
              </div>
              <button style={{
                width: "100%", padding: "14px", borderRadius: 10, border: "none",
                background: "linear-gradient(135deg, #FF385C, #E31C5F)", color: "#fff",
                fontWeight: 700, fontSize: 16, cursor: "pointer",
              }}>Reserve</button>
              <p style={{ textAlign: "center", fontSize: 13, color: "#717171", margin: "12px 0 0" }}>You won't be charged yet</p>
              <hr style={{ border: "none", borderTop: "1px solid #ebebeb", margin: "16px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#222", marginBottom: 6 }}>
                <span>${d8.price} × 5 nights</span><span>${d8.price * 5}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#222", marginBottom: 6 }}>
                <span>Cleaning fee</span><span>$25</span>
              </div>
              <hr style={{ border: "none", borderTop: "1px solid #ebebeb", margin: "10px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 15, color: "#222" }}>
                <span>Total before taxes</span><span>${d8.price * 5 + 25}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ── Mobile Preview ─────────────────────────
  const MobilePreview = () => (
    <div style={{ display: "flex", justifyContent: "center" }}>
      {/* iPhone 15 frame */}
      <div style={{
        width: 375, position: "relative",
        border: "10px solid #1a1a1a", borderRadius: 50,
        boxShadow: "0 0 0 2px #333, 0 20px 60px rgba(0,0,0,0.35), inset 0 0 0 1px #444",
        overflow: "hidden", background: "#fff",
      }}>
        {/* Dynamic Island */}
        <div style={{
          position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)",
          width: 120, height: 34, background: "#1a1a1a", borderRadius: 20, zIndex: 10,
        }} />

        {/* Status bar */}
        <div style={{
          height: 52, background: "#fff", display: "flex", alignItems: "flex-end",
          justifyContent: "space-between", padding: "0 24px 8px",
        }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#222" }}>9:41</span>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ fontSize: 11 }}>●●●●</span>
            <span style={{ fontSize: 11 }}>WiFi</span>
            <span style={{ fontSize: 11 }}>🔋</span>
          </div>
        </div>

        {/* Scrollable content */}
        <div style={{ height: 680, overflowY: "auto", background: "#fff" }}>
          {/* Header */}
          <div style={{ padding: "8px 16px 12px", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid #f0f0f0" }}>
            <div style={{ width: 24, height: 24, borderRadius: 6, background: "linear-gradient(135deg,#FF385C,#E31C5F)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontSize: 12 }}>✦</span>
            </div>
            <span style={{ fontWeight: 800, fontSize: 15, color: "#FF385C" }}>airform</span>
          </div>

          {/* Hero photo */}
          <div style={{
            height: 220, background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 64, position: "relative",
          }}>
            {coverPhoto}
            {d9.instant && (
              <div style={{
                position: "absolute", top: 10, left: 10, background: "#222",
                color: "#fff", borderRadius: 12, padding: "3px 8px", fontSize: 10, fontWeight: 700,
              }}>⚡ Instant</div>
            )}
            {selectedPhotos.length > 1 && (
              <div style={{
                position: "absolute", bottom: 10, right: 10,
                background: "rgba(255,255,255,0.92)", borderRadius: 6, padding: "3px 8px",
                fontSize: 11, fontWeight: 600, color: "#222",
              }}>1 / {selectedPhotos.length}</div>
            )}
          </div>

          {/* Content */}
          <div style={{ padding: "16px 16px 40px" }}>
            <p style={{ margin: "0 0 2px", fontSize: 11, color: "#717171" }}>
              {privacyLabels[d2.privacy] || "Place"} · {typeLabels[d1.type] || "Property"}
            </p>
            <h2 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 800, color: "#1a1a1a", lineHeight: 1.2 }}>{title}</h2>
            <p style={{ margin: "0 0 8px", fontSize: 12, color: "#717171" }}>📍 {location}</p>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 12, color: "#717171" }}>
                {d3.guests} guests · {d3.bedrooms}bd · {d3.beds}be · {d3.bathrooms}ba
              </span>
              <span style={{ fontSize: 12, color: "#FF385C", fontWeight: 700 }}>{stars} 5.0</span>
            </div>

            <hr style={{ border: "none", borderTop: "1px solid #f0f0f0", margin: "12px 0" }} />

            <p style={{ fontSize: 13, color: "#444", lineHeight: 1.6, margin: "0 0 16px" }}>{description}</p>

            {(d4.amenities || []).length > 0 && (
              <>
                <p style={{ fontWeight: 700, fontSize: 13, color: "#222", margin: "0 0 10px" }}>What's included</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                  {(d4.amenities || []).map((a) => (
                    <span key={a} style={{
                      padding: "4px 10px", borderRadius: 20, background: "#f5f5f5",
                      fontSize: 11, fontWeight: 600, color: "#444",
                    }}>
                      {amenityIcons[a]} {amenityLabels[a] || a}
                    </span>
                  ))}
                </div>
              </>
            )}

            <hr style={{ border: "none", borderTop: "1px solid #f0f0f0", margin: "12px 0" }} />
            <div style={{ display: "flex", gap: 16, fontSize: 11, color: "#717171", marginBottom: 20 }}>
              <span>📅 {d9.minNights}–{d9.maxNights} nights</span>
            </div>

            {/* Sticky bottom bar */}
            <div style={{
              background: "#fff", borderTop: "1px solid #ebebeb", padding: "14px 0 0",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <div>
                <span style={{ fontSize: 18, fontWeight: 800, color: "#222" }}>${d8.price}</span>
                <span style={{ fontSize: 12, color: "#717171" }}> / night</span>
              </div>
              <button style={{
                padding: "11px 22px", borderRadius: 10, border: "none",
                background: "linear-gradient(135deg,#FF385C,#E31C5F)", color: "#fff",
                fontWeight: 700, fontSize: 14, cursor: "pointer",
              }}>Reserve</button>
            </div>
          </div>
        </div>

        {/* Home indicator */}
        <div style={{ height: 28, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 130, height: 5, background: "#1a1a1a", borderRadius: 3 }} />
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 860, width: "100%" }}>
      {/* Toggle */}
      <div style={{
        display: "inline-flex", gap: 0, padding: 4, borderRadius: 14,
        background: "#f5f5f5", border: "1.5px solid #e8e8e8", marginBottom: 28,
      }}>
        {[
          { key: "web", icon: "🖥️", label: "Web Preview" },
          { key: "mobile", icon: "📱", label: "Mobile Preview" },
        ].map(({ key, icon, label }) => (
          <button
            key={key}
            onClick={() => setMode(key)}
            style={{
              padding: "9px 20px", border: "none", borderRadius: 10, cursor: "pointer",
              fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center", gap: 7,
              transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)",
              background: mode === key ? "#fff" : "transparent",
              color: mode === key ? "#1a1a1a" : "#888",
              boxShadow: mode === key ? "0 2px 10px rgba(0,0,0,0.10)" : "none",
            }}
          >
            <span style={{ fontSize: 16 }}>{icon}</span> {label}
          </button>
        ))}
      </div>

      {/* Preview area */}
      <div style={{
        transition: "opacity 0.22s ease",
        overflowX: mode === "mobile" ? "visible" : "auto",
      }}>
        {mode === "web" ? <WebPreview /> : <MobilePreview />}
      </div>
    </div>
  );
}

function Step10Content() {
  const { stepStates, steps } = useStepper();
  return (
    <div style={{ maxWidth: 600 }}>
      <div style={{
        background: "linear-gradient(135deg, #FFF0F3, #fff)", border: "2px solid #FFD0DA",
        borderRadius: 20, padding: 32, marginBottom: 24,
      }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 56 }}>🎊</div>
          <h2 style={{ fontWeight: 800, fontSize: 24, color: "#222", margin: "12px 0 8px" }}>You're almost there!</h2>
          <p style={{ color: "#717171", fontSize: 15 }}>Review your listing details before publishing</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {steps.filter(s => s.id !== "step-preview" && s.id !== "step-10").map((step, i) => {
            const state = stepStates.find(s => s.id === step.id);
            return (
              <div key={step.id} style={{
                padding: "12px 16px", borderRadius: 12, background: "#fff",
                border: "1.5px solid #e5e5e5", display: "flex", alignItems: "center", gap: 10,
              }}>
                <span style={{
                  width: 24, height: 24, borderRadius: "50%",
                  background: state?.completed ? "#222" : "#f0f0f0",
                  color: state?.completed ? "#fff" : "#aaa",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 700, flexShrink: 0,
                }}>
                  {state?.completed ? "✓" : i + 1}
                </span>
                <span style={{ fontSize: 13, fontWeight: 500, color: state?.completed ? "#222" : "#aaa" }}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <p style={{ fontSize: 13, color: "#888", lineHeight: 1.6, textAlign: "center" }}>
        By publishing, you agree to our hosting standards. Your listing will be reviewed within 24 hours.
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────
// SAMPLE STEPS CONFIG
// ─────────────────────────────────────────────

const SAMPLE_STEPS = [
  {
    id: "step-1",
    title: "What kind of place will you host?",
    description: "Choose the property type that best describes your space.",
    content: <Step1Content />,
    validate: (data) => data.type ? null : "Please select a property type to continue.",
  },
  {
    id: "step-2",
    title: "What will guests have?",
    description: "Let guests know whether they'll have the whole place, a private room, or a shared room.",
    content: <Step2Content />,
    validate: (data) => data.privacy ? null : "Please select an option to continue.",
  },
  {
    id: "step-3",
    title: "Share some basics about your place",
    description: "You'll add more details later, such as bed types.",
    content: <Step3Content />,
    validate: () => null,
  },
  {
    id: "step-4",
    title: "Tell guests what your place has to offer",
    description: "You can add more amenities after you publish.",
    content: <Step4Content />,
    validate: (data) => (data.amenities?.length ?? 0) >= 2 ? null : "Select at least 2 amenities.",
  },
  {
    id: "step-5",
    title: "Create your title and description",
    description: "A great title and description will help guests understand your space.",
    content: <Step5Content />,
    validate: (data) => {
      if (!data.title?.trim()) return "Please add a title for your listing.";
      if (!data.description?.trim()) return "Please add a description for your listing.";
      return null;
    },
  },
  {
    id: "step-6",
    title: "Add some photos of your place",
    description: "Photos help guests imagine staying in your place.",
    content: <Step6Content />,
    validate: (data) => (data.photos?.length ?? 0) >= 3 ? null : "Please select at least 3 photos.",
  },
  {
    id: "step-7",
    title: "Where's your place located?",
    description: "Your address is only shared with guests after they book.",
    content: <Step7Content />,
    validate: (data) => {
      if (!data.country?.trim()) return "Please enter a country.";
      if (!data.city?.trim()) return "Please enter a city.";
      return null;
    },
  },
  {
    id: "step-8",
    title: "Now, set your price",
    description: "You can change it anytime. We'll share data to help you decide.",
    content: <Step8Content />,
    validate: (data) => data.price >= 10 ? null : "Price must be at least $10.",
  },
  {
    id: "step-9",
    title: "Choose your booking settings",
    description: "Decide how guests can book and how long they can stay.",
    content: <Step9Content />,
    validate: () => null,
  },
  {
    id: "step-preview",
    title: "Preview your listing",
    description: "See exactly how your listing will look to guests on web and mobile before publishing.",
    content: <PreviewListingContent />,
    validate: () => null,
  },
  {
    id: "step-10",
    title: "Review and publish",
    description: "Take a final look before your listing goes live.",
    content: <Step10Content />,
    validate: () => null,
  },
];

// ─────────────────────────────────────────────
// ROOT APP
// ─────────────────────────────────────────────

export default function App() {
  return (
    <StepperProvider initialSteps={SAMPLE_STEPS}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; }
        input[type=range] { -webkit-appearance: none; height: 4px; border-radius: 2px; background: #e5e5e5; outline: none; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 22px; height: 22px; border-radius: 50%; background: #222; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.18); }
      `}</style>
      <StepperContainer />
    </StepperProvider>
  );
}
