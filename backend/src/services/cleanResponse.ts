export function cleanCohereResponse(raw: string): string {
  let cleaned = raw
    // Remove $$...$$ and \[...\]
    .replace(/\${1,2}([^$]+)\${1,2}/g, (_, expr) => expr)
    .replace(/\\\(([^)]+)\\\)/g, (_, expr) => expr)
    .replace(/\\\[([^\]]+)\\\]/g, (_, expr) => expr)

    // Replace LaTeX-style fractions
    .replace(/\\frac\s*{([^}]+)}\s*{([^}]+)}/g, "($1 / $2)")

    // Replace other common LaTeX symbols
    .replace(/\\cdot/g, "·")
    .replace(/\\times/g, "×")
    .replace(/\\left\s*/g, "")
    .replace(/\\right\s*/g, "")
    .replace(/\\text\s*{([^}]+)}/g, "$1")
    .replace(/\\,/g, " ")
    .replace(/\\{/g, "{").replace(/\\}/g, "}")
    .replace(/\\\\/g, "\n")
    .replace(/\\n/g, "\n")

    // Cleanup extra spaces and lines
    .replace(/\s{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  // Extract \boxed{...} → Final Answer
  const boxedMatch = cleaned.match(/\\boxed\s*{([^}]+)}/);
  if (boxedMatch) {
    const answer = boxedMatch[1].replace(/\\text\s*{([^}]+)}/g, "$1").replace(/\\,/g, " ");
    cleaned = cleaned.replace(/\\boxed\s*{[^}]+}/, `**Final Answer: ${answer.trim()}**`);
  }

  // Add labels to common sections
  cleaned = cleaned
    .replace(/(from the graph[:,]?)/i, "**From the graph:**")
    .replace(/(we can use the formula[:,]?)/i, "**Formula:**")
    .replace(/(to find|to calculate|this means)/gi, (m) => `**Step:** ${m}`)
    .replace(/(the area under[^:\n]*)[:,]?/gi, "**Given:** $1:")
    .replace(/so, the final answer is\s*\(.*?\)\.?/gi, "") // remove duplicate final line if answer boxed
    .replace(/\n{2,}/g, "\n\n");

  return cleaned;
}
