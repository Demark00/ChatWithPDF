export const buildPromptFromChunks = (
  chunks: string[],
  question: string
): string => {
  const formattingGuidelines = `
📌 **Instructions for Answering**:
- Respond **accurately**, **clearly**, and **concisely**.
- Use **markdown** formatting only when it enhances readability:
  - Headings (##), bold (**text**), bullet points (-), numbered steps (1.), etc.
  - Use inline equations (e.g. \`(a + b)^2 = a^2 + 2ab + b^2\`) for math problems.
- For short/simple questions (e.g. one-liners, yes/no, definitions), keep it brief.
- For complex or multi-step questions (e.g. math, logic, analysis), provide a clean, step-by-step solution.
- If the answer is **not in the document**, rely on your own knowledge, but clearly avoid hallucinating content.
`;

  const header = `You are a helpful and intelligent AI assistant.`;

  const userQuestion = `**User's Question:**\n${question}`;

  const answerPlaceholder = `**Your Answer:**`;

  if (chunks.length === 0) {
    return `${header}

The user uploaded a PDF, but no relevant content was found.

${formattingGuidelines}

---

${userQuestion}

---

${answerPlaceholder}`;
  }

  const context = chunks.join("\n\n");

  return `${header}

You are given some PDF content and a user question. Use the PDF if relevant. If not, answer using your own knowledge.

${formattingGuidelines}

---

**PDF Context (Top ${chunks.length} Relevant Chunks):**

${context}

---

${userQuestion}

---

${answerPlaceholder}`;
};
