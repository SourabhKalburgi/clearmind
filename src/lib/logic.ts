import { Criterion, Option, Score } from "@prisma/client";

export type OptionWithScores = Option & { scores: Score[] };

/**
 * Calculates the total weighted score for an option.
 * Formula: Sum(Score.value * Criterion.weight)
 */
export function calculateWeightedSum(inputs: { weight: number, value: number }[]): number {
    return inputs.reduce((sum, item) => sum + (item.weight * item.value), 0);
}

export function calculateOptionScore(option: OptionWithScores, criteria: Criterion[]): number {
    // Create a map for quick lookup of scores by criterionId
    const scoreMap = new Map<string, number>();
    option.scores.forEach(s => scoreMap.set(s.criterionId, s.value));

    const inputs = criteria.map(criterion => ({
        weight: criterion.weight,
        value: scoreMap.get(criterion.id) || 0 // Default to 0 if not scored
    }));

    return calculateWeightedSum(inputs);
}

/**
 * Checks if the decision matrix is fully completed.
 * Required: 
 * 1. At least 1 option
 * 2. At least 1 criterion
 * 3. Every option must have a score for every criterion
 */
export function isDecisionMatrixComplete(options: OptionWithScores[], criteria: Criterion[]): boolean {
    if (options.length === 0 || criteria.length === 0) {
        return false;
    }

    const totalRequiredScores = options.length * criteria.length;
    let currentScoreCount = 0;

    options.forEach(opt => {
        criteria.forEach(crit => {
            const hasScore = opt.scores.some(s => s.criterionId === crit.id);
            if (hasScore) currentScoreCount++;
        });
    });

    return currentScoreCount === totalRequiredScores;
}

/**
 *  Returns the option with the highest calculated score.
 *  Returns null if no options exist.
 */
export function getBestOption(options: OptionWithScores[], criteria: Criterion[]): OptionWithScores | null {
    if (options.length === 0) return null;

    let bestOption: OptionWithScores | null = null;
    let maxScore = -1;

    options.forEach(option => {
        const score = calculateOptionScore(option, criteria);
        if (score > maxScore) {
            maxScore = score;
            bestOption = option;
        }
    });

    return bestOption;
}
