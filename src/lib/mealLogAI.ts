import { parseFirstJsonObject } from './aiJson';
import { openRouterClient, OpenRouterError, OpenRouterErrorType } from './openrouter';
import { logger } from './logger';

/**
 * Response format expected from the LLM for meal log processing
 */
interface MealLogAIResponse {
  meal_name: string;
  macros: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}
 
/**
 * Generate system and user prompts for meal log processing
 * @param items Array of food item strings
 * @returns Object with system and user prompts
 */
function generateMealLogPrompts(items: string[]) {
  const itemsList = items.map(item => `- ${item}`).join('\n');

  const systemPrompt = `SYSTEM PROMPT:
You are a nutrition calculator that returns VALID JSON only.
Schema:
{
  "meal_name": "Descriptive name for the meal based on the items",
  "macros": {
    "calories": 450,
    "protein": 25,
    "carbs": 35,
    "fat": 18
  }
}

Rules:
- Output JSON only. No prose, no markdown.
- Create a descriptive meal name based on the food items provided
- Calculate realistic total macronutrients for all items combined
- Base calculations on typical nutritional values for the specified quantities
- IMPORTANT: When user says "1 sirloin steak" or "1 chicken breast", interpret as the ENTIRE item, not a serving size
  - "1 sirloin steak" = whole steak (8-12 oz) = ~600-900 calories, 50-75g protein
  - "1 chicken breast" = whole breast (6-8 oz) = ~350-500 calories, 50-70g protein
  - "16 oz sirloin steak" = full pound = ~1000+ calories, 80-100g protein
  - "1 apple" = whole medium apple
  - "1 banana" = whole medium banana
  - "1 air fried potato" = medium russet potato (~200g) = ~200-250 calories, 4-5g protein
- If quantities aren't specified, assume reasonable whole item portions
- For cooking methods that add fat (fried, air fried with oil), add appropriate calories from oil/fat
- Use accurate nutritional values based on USDA data and standard serving sizes
- Do not underestimate - provide realistic and accurate macro calculations
- All macro values should be integers (round to nearest whole number)
- Meal name should be concise but descriptive (e.g., "Scrambled Eggs with Toast", "Greek Yogurt Bowl")`;

  const userPrompt = `USER PROMPT:
Analyze these food items and calculate the total nutrition:

${itemsList}

Generate a suitable meal name and calculate the total macronutrients for all items combined.
Return a single JSON object with the meal name and macros.`;

  return { systemPrompt, userPrompt };
}

/**
 * Get a preview of the prompts that would be sent to the AI
 * @param items Array of food item strings
 * @returns Combined prompt string for preview
 */
export function getMealLogPromptPreview(items: string[]): string {
  if (!items || items.length === 0) {
    return "Please add some food items first to see the AI prompt preview.";
  }

  const { systemPrompt, userPrompt } = generateMealLogPrompts(items);
  return `${systemPrompt}\n\n${userPrompt}`;
}

/**
 * Process a list of food items through the LLM to generate meal log data
 * @param items Array of food item strings (e.g., ["2 eggs", "1 slice bread", "1 tbsp butter"])
 * @returns Promise with generated meal name and macros
 */
export async function processMealLogWithAI(items: string[]): Promise<MealLogAIResponse> {
  if (!items || items.length === 0) {
    throw new Error('Items array cannot be empty');
  }

  // Generate prompts
  const { userPrompt } = generateMealLogPrompts(items);

  try {
    // Use the shared OpenRouter client
    const response = await openRouterClient.makeRequestWithRetry({
      model: "microsoft/mai-ds-r1:free",
      temperature: 0.1,
      top_p: 0.9,
      max_tokens: 1000,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are a nutrition calculator that returns VALID JSON only.
Schema:
{
  "meal_name": "Descriptive name for the meal based on the items",
  "macros": {
    "calories": 450,
    "protein": 25,
    "carbs": 35,
    "fat": 18
  }
}

Rules:
- Output JSON only. No prose, no markdown.
- Create a descriptive meal name based on the food items provided
- Calculate realistic total macronutrients for all items combined
- Base calculations on typical nutritional values for the specified quantities
- IMPORTANT: When user says "1 sirloin steak" or "1 chicken breast", interpret as the ENTIRE item, not a serving size
  - "1 sirloin steak" = whole steak (8-12 oz) = ~600-900 calories, 50-75g protein
  - "1 chicken breast" = whole breast (6-8 oz) = ~350-500 calories, 50-70g protein
  - "16 oz sirloin steak" = full pound = ~1000+ calories, 80-100g protein
  - "1 apple" = whole medium apple
  - "1 banana" = whole medium banana
  - "1 air fried potato" = medium russet potato (~200g) = ~200-250 calories, 4-5g protein
- If quantities aren't specified, assume reasonable whole item portions
- For cooking methods that add fat (fried, air fried with oil), add appropriate calories from oil/fat
- Use accurate nutritional values based on USDA data and standard serving sizes
- Do not underestimate - provide realistic and accurate macro calculations
- All macro values should be integers (round to nearest whole number)
- Meal name should be concise but descriptive (e.g., "Scrambled Eggs with Toast", "Greek Yogurt Bowl")`
        },
        {
          role: "user",
          content: `Analyze these food items and calculate the total nutrition:

${items.map(item => `- ${item}`).join('\n')}

Generate a suitable meal name and calculate the total macronutrients for all items combined.
Return a single JSON object with the meal name and macros.`
        }
      ]
    }, 'Meal Log Processing', 1); // Allow 1 retry

    const generatedText = response.choices[0].message.content;

    // Try to extract JSON from the response (robust)
    let parsedResponse: MealLogAIResponse;
    try {
      parsedResponse = parseFirstJsonObject(generatedText);
    } catch (parseError) {
      const error: OpenRouterError = {
        type: OpenRouterErrorType.JSON_PARSE_ERROR,
        message: 'Failed to parse meal log AI response',
        details: { parseError, rawResponse: generatedText },
        shouldRetry: false
      };
      throw error;
    }

    // Validate the parsed response
    if (!parsedResponse.meal_name || !parsedResponse.macros) {
      const error: OpenRouterError = {
        type: OpenRouterErrorType.RESPONSE_VALIDATION_ERROR,
        message: 'AI response missing required fields (meal_name or macros)',
        details: { response: parsedResponse },
        shouldRetry: false
      };
      throw error;
    }

    const { calories, protein, carbs, fat } = parsedResponse.macros;
    if (typeof calories !== 'number' || typeof protein !== 'number' ||
        typeof carbs !== 'number' || typeof fat !== 'number') {
      const error: OpenRouterError = {
        type: OpenRouterErrorType.RESPONSE_VALIDATION_ERROR,
        message: 'AI response contains invalid macro values',
        details: { macros: parsedResponse.macros },
        shouldRetry: false
      };
      throw error;
    }

    // Ensure all values are positive
    if (calories < 0 || protein < 0 || carbs < 0 || fat < 0) {
      const error: OpenRouterError = {
        type: OpenRouterErrorType.RESPONSE_VALIDATION_ERROR,
        message: 'AI response contains negative nutrition values',
        details: { macros: parsedResponse.macros },
        shouldRetry: false
      };
      throw error;
    }

    return parsedResponse;
  } catch (error) {
    // Re-throw OpenRouterError as-is, convert others to OpenRouterError
    if (error instanceof Error && 'type' in error) {
      throw error;
    }

    const openRouterError: OpenRouterError = {
      type: OpenRouterErrorType.UNKNOWN_ERROR,
      message: error instanceof Error ? error.message : 'Unknown error processing meal log',
      details: { originalError: error },
      shouldRetry: false
    };
    throw openRouterError;
  }
}

/**
 * Process multiple meal entries in batch
 * @param mealEntries Array of meal entries, each containing an items array
 * @returns Promise with array of generated meal log data
 */
export async function processBatchMealLogsWithAI(
  mealEntries: { items: string[] }[]
): Promise<MealLogAIResponse[]> {
  if (!mealEntries || mealEntries.length === 0) {
    throw new Error('Meal entries array cannot be empty');
  }

  // Process each meal entry individually to maintain accuracy
  const results: MealLogAIResponse[] = [];

  for (let i = 0; i < mealEntries.length; i++) {
    try {
      const result = await processMealLogWithAI(mealEntries[i].items);
      results.push(result);
    } catch (error) {
      logger.error(`Failed to process meal entry ${i + 1}:`, error);
      // Re-throw with context
      throw new Error(`Failed to process meal ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  return results;
}