export function cleanCohereResponse(raw: string): string {
  let cleaned = raw
    // Remove LaTeX blocks and inline math
    .replace(/\${1,2}([^$]+)\${1,2}/g, (_, expr) => expr)
    .replace(/\\\(([^)]+)\\\)/g, (_, expr) => expr)
    .replace(/\\\[([^\]]+)\\\]/g, (_, expr) => expr)

    // Convert \frac{a}{b} → (a / b)
    .replace(/\\frac\s*{([^}]+)}\s*{([^}]+)}/g, "($1 / $2)")

    // Handle common LaTeX syntax
    .replace(/\\cdot/g, "·")
    .replace(/\\times/g, "×")
    .replace(/\\left\s*/g, "")
    .replace(/\\right\s*/g, "")
    .replace(/\\text\s*{([^}]+)}/g, "$1")
    .replace(/\\,/g, " ")
    .replace(/\\\\/g, "\n")
    .replace(/\\n/g, "\n")
    .replace(/[{}]/g, "")
    .replace(/\*\*/g, "") // remove bold
    .replace(/\s{2,}/g, " ")

    // Replace subscripts
    .replace(/\bI_0\b/g, "I₀")
    .replace(/\bf_0\b/g, "f₀")
    .replace(/\bt_0\b/g, "t₀")
    .replace(/\bR_0\b/g, "R₀")
    .replace(/\\Delta/g, "Δ")

    // Clean up duplicate whitespace
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  // Extract boxed answer
  const boxedMatch = cleaned.match(/\\boxed\s*{([^}]+)}/);
  if (boxedMatch) {
    const answer = boxedMatch[1]
      .replace(/\\text\s*{([^}]+)}/g, "$1")
      .replace(/\\,/g, " ");
    cleaned = cleaned.replace(/\\boxed\s*{[^}]+}/, `Final Answer: ${answer.trim()}`);
  }

  // Format line breaks before labels and math lines
  cleaned = cleaned
    .replace(/(?<=^|\n)(Step|Final Step|Answer|Formula|Given|From the graph)(:)?/gi, "\n$1:")
    .replace(/([=+\-*/^()])\s*/g, " $1 ") // spacing around math ops
    .replace(/ +/g, " ") // fix spacing
    .replace(/\n{2,}/g, "\n\n")
    .trim();

  // Auto-indent bullet points if any
  cleaned = cleaned
    .replace(/- /g, "\n- ")
    .replace(/• /g, "\n• ");

  return cleaned;
}
