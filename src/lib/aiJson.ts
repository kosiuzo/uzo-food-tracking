// Utility to robustly extract and parse a JSON object from AI model output

// Extract content inside the first triple backtick fence (optional "json" tag)
function extractFromCodeFence(text: string): string | null {
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  return fenceMatch ? fenceMatch[1].trim() : null;
}

// Extract content inside <final>...</final> tags (used by some reasoning models)
function extractFromFinalTag(text: string): string | null {
  const finalMatch = text.match(/<final>\s*([\s\S]*?)\s*<\/final>/i);
  return finalMatch ? finalMatch[1].trim() : null;
}

// Extract the first balanced JSON object by brace matching (ignores braces inside strings)
function extractBalancedJsonObject(text: string): string | null {
  const start = text.indexOf('{');
  if (start === -1) return null;

  let depth = 0;
  let inString: false | '"' | "'" = false;
  let escape = false;

  for (let i = start; i < text.length; i++) {
    const ch = text[i];

    if (inString) {
      if (escape) {
        escape = false;
      } else if (ch === '\\') {
        escape = true;
      } else if (ch === inString) {
        inString = false;
      }
      continue;
    }

    if (ch === '"' || ch === "'") {
      inString = ch as '"' | "'";
    } else if (ch === '{') {
      depth++;
    } else if (ch === '}') {
      depth--;
      if (depth === 0) {
        return text.slice(start, i + 1);
      }
    }
  }

  return null;
}

// Sanitize typical JSON issues from model output (smart quotes, trailing commas)
function sanitizeJson(text: string): string {
  return text
    // Replace smart quotes
    .replace(/[\u201C\u201D\u201E\u201F\u00AB\u00BB]/g, '"')
    .replace(/[\u2018\u2019]/g, "'")
    // Remove trailing commas before closing braces/brackets
    .replace(/,(\s*[}\]])/g, '$1')
    .trim();
}

export function extractFirstJsonObject(text: string): string | null {
  if (!text) return null;
  return (
    extractFromCodeFence(text) ||
    extractFromFinalTag(text) ||
    extractBalancedJsonObject(text)
  );
}

export function parseFirstJsonObject<T = any>(text: string): T {
  const candidate = extractFirstJsonObject(text);
  if (!candidate) {
    throw new Error('No JSON found in response');
  }
  try {
    return JSON.parse(candidate) as T;
  } catch {
    const cleaned = sanitizeJson(candidate);
    return JSON.parse(cleaned) as T;
  }
}

