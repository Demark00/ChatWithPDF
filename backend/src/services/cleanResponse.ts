/**
 * Cleans up and formats LLM responses containing textual explanations and math/LaTeX,
 * aiming for clear, readable output for any mixture of math and natural explanations.
 */
export function cleanCohereResponse(raw: string): string {
  let cleaned = raw;

  // 1. Remove inline and block LaTeX delimiters, but keep the math inside
  cleaned = cleaned
    // $$...$$ or $...$
    .replace(/\${1,2}([^$]+)\${1,2}/g, (_, expr) => expr)
    // \( ... \), \[ ... \]
    .replace(/\\\(([^)]+)\\\)/g, (_, expr) => expr)
    .replace(/\\\[((?:.|\n)+?)\\\]/g, (_, expr) => expr);

  // 2. Handle common LaTeX commands and math formatting
  cleaned = cleaned
    .replace(/\\frac\s*{([^}]+)}\s*{([^}]+)}/g, "($1 / $2)")
    .replace(/\\cdot/g, "·")
    .replace(/\\times/g, "×")
    .replace(/\\leq/g, "≤")
    .replace(/\\geq/g, "≥")
    .replace(/\\neq/g, "≠")
    .replace(/\\approx/g, "≈")
    .replace(/\\pm/g, "±")
    .replace(/\\left\s*/g, "")
    .replace(/\\right\s*/g, "")
    .replace(/\\text\s*{([^}]+)}/g, "$1")
    .replace(/\\,|\\;/g, " ")
    .replace(/\\\\/g, "\n")
    .replace(/\\n/g, "\n")
    // Remove excessive braces, but keep math grouping
    .replace(/(?<!\\)[{}]/g, "")
    // Remove bold (**)
    .replace(/\*\*/g, "")
    // Replace common subscripts
    .replace(/\bI_0\b/g, "I₀")
    .replace(/\bf_0\b/g, "f₀")
    .replace(/\bt_0\b/g, "t₀")
    .replace(/\bR_0\b/g, "R₀")
    .replace(/_([a-zA-Z0-9])/g, (m, c) => {
      // Unicode subscript for numbers/letters
      const subMap: { [k: string]: string } = { 0: "₀", 1: "₁", 2: "₂", 3: "₃", 4: "₄", 5: "₅", 6: "₆", 7: "₇", 8: "₈", 9: "₉", a: "ₐ", e: "ₑ", h: "ₕ", i: "ᵢ", j: "ⱼ", k: "ₖ", l: "ₗ", m: "ₘ", n: "ₙ", o: "ₒ", p: "ₚ", r: "ᵣ", s: "ₛ", t: "ₜ", u: "ᵤ", v: "ᵥ", x: "ₓ" };
      return subMap[c] || "_" + c;
    })
    .replace(/\\Delta/g, "Δ")
    .replace(/\\alpha/g, "α")
    .replace(/\\beta/g, "β")
    .replace(/\\gamma/g, "γ")
    .replace(/\\theta/g, "θ")
    .replace(/\\pi/g, "π")
    .replace(/\\sqrt\s*{([^}]+)}/g, "√($1)")
    // Remove remaining LaTeX commands (fallback)
    .replace(/\\[a-zA-Z]+/g, "");

  // 3. Extract all \boxed answers and replace with Final Answer
  cleaned = cleaned.replace(/\\boxed\s*{([^}]+)}/g, (_, boxContent) =>
    `\nFinal Answer: ${boxContent.trim()}`
  );

  // 4. Structure steps, formulas, etc. for clarity
  cleaned = cleaned.replace(
    /(?<=^|\n)(Step|Final Step|Answer|Formula|Given|From the graph|Explanation|Calculation|Result|Solution)(:)?/gi,
    "\n$1:"
  );

  // 5. Format math operators with spacing
  cleaned = cleaned.replace(/([=+\-*/^()])/g, " $1 ");
  // Collapse multiple spaces, but preserve line breaks
  cleaned = cleaned.replace(/[ \t]+/g, " ");
  cleaned = cleaned.replace(/\n{3,}/g, "\n\n");
  cleaned = cleaned.replace(/ +\n/g, "\n");
  cleaned = cleaned.replace(/\n +/g, "\n");

  // 6. Improve bullet points and numbered lists (auto-indent)
  cleaned = cleaned
    .replace(/ *- /g, "\n- ")
    .replace(/ *• /g, "\n• ")
    .replace(/ *\d+\.\s+/g, (m) => "\n" + m.trim());

  // 7. Clean up markdown/code artifacts
  cleaned = cleaned.replace(/```[a-z]*\n?([\s\S]*?)```/g, (m, code) => `\n${code.trim()}\n`);

  // 8. Final clean-up
  cleaned = cleaned
    .replace(/\n{2,}/g, "\n\n")
    .replace(/[ \t]+$/gm, "")
    .trim();

  return cleaned;
}