import { describe, it, expect } from 'vitest';
import { calculateOptionScore, isDecisionMatrixComplete, getBestOption, OptionWithScores, calculateWeightedSum } from './logic';

import { Criterion, Score } from '@prisma/client';

describe('Decision Logic', () => {
    // Mock Data
    const criteria: Criterion[] = [
        { id: 'c1', name: 'Price', weight: 5, decisionId: 'd1' },
        { id: 'c2', name: 'Performance', weight: 3, decisionId: 'd1' },
    ];

    const optionA: OptionWithScores = {
        id: 'o1',
        title: 'Option A',
        description: null,
        decisionId: 'd1',
        scores: [
            { id: 's1', optionId: 'o1', criterionId: 'c1', value: 4 }, // 4 * 5 = 20
            { id: 's2', optionId: 'o1', criterionId: 'c2', value: 5 }, // 5 * 3 = 15
        ] // Total = 35
    };

    const optionB: OptionWithScores = {
        id: 'o2',
        title: 'Option B',
        description: null,
        decisionId: 'd1',
        scores: [
            { id: 's3', optionId: 'o2', criterionId: 'c1', value: 2 }, // 2 * 5 = 10
            { id: 's4', optionId: 'o2', criterionId: 'c2', value: 3 }, // 3 * 3 = 9
        ] // Total = 19
    };

    const optionIncomplete: OptionWithScores = {
        id: 'o3',
        title: 'Option C',
        description: null,
        decisionId: 'd1',
        scores: [
            { id: 's5', optionId: 'o3', criterionId: 'c1', value: 5 },
            // Missing c2
        ]
    };

    describe('calculateOptionScore', () => {
        it('should calculate weighted sum correctly', () => {
            expect(calculateOptionScore(optionA, criteria)).toBe(35);
        });

        it('should handle missing scores as 0', () => {
            // Option C misses one score (weight 3), so 5*5 + 0*3 = 25
            expect(calculateOptionScore(optionIncomplete, criteria)).toBe(25);
        });

        it('should return 0 if no criteria match', () => {
            const emptyCriteria: Criterion[] = [];
            expect(calculateOptionScore(optionA, emptyCriteria)).toBe(0);
        });
    });

    describe('isDecisionMatrixComplete', () => {
        it('should return true when all scores are present', () => {
            expect(isDecisionMatrixComplete([optionA, optionB], criteria)).toBe(true);
        });

        it('should return false when a score is missing', () => {
            expect(isDecisionMatrixComplete([optionA, optionIncomplete], criteria)).toBe(false);
        });

        it('should return false if there are no options', () => {
            expect(isDecisionMatrixComplete([], criteria)).toBe(false);
        });

        it('should return false if there are no criteria', () => {
            expect(isDecisionMatrixComplete([optionA], [])).toBe(false);
        });
    });

    describe('getBestOption', () => {
        it('should return the option with the highest score', () => {
            const result = getBestOption([optionA, optionB], criteria);
            expect(result?.id).toBe(optionA.id);
        });

        it('should return null for empty options list', () => {
            expect(getBestOption([], criteria)).toBeNull();
        });
    });

    describe('calculateWeightedSum', () => {
        it('should calculate weighted sum correctly', () => {
            const inputs = [
                { weight: 5, value: 4 },
                { weight: 3, value: 5 }
            ];
            expect(calculateWeightedSum(inputs)).toBe(35);
        });

        it('should return 0 for empty inputs', () => {
            expect(calculateWeightedSum([])).toBe(0);
        });
    });
});
