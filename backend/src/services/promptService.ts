export const buildPromptFromChunks = (
  chunks: string[],
  question: string
): string => {
  if (chunks.length === 0) {
    return `You are a helpful assistant. The user has asked a question based on a PDF document, but no relevant content could be found in the document.

Please respond honestly and say that you could not find any matching content in the document. Do not hallucinate.
and give them the answer based on internet information. And don't forget to tell them that you've gave answer based on internet information.
---

**User's Question:**  
${question}

---

**Your Answer:**`;
  }

  const context = chunks

  return `You are a helpful and intelligent AI assistant that helps users understand PDF documents they upload.

Always provide clear, structured, and context-aware answers based only on the **PDF content** provided below.

📌 **Important Instructions**:
- ONLY answer based on the "PDF Context" below.
- If the answer is not present in the PDF, respond:  
  _"The answer to this question is not available in the provided document and search for that answer on internet and then also tell them that you're searched for answer from internet."_
- If the question is some kind of mathematical or solving. You've to solve it and give it's solution.
- Do **not hallucinate**.
- Use **markdown formatting** (lists, headings, tables) for clarity.

---

**PDF Context (Top ${chunks.length} Relevant Chunks):**  
${context}

---

**User's Question:**  
${question}

---

**Your Answer:**`;
};
