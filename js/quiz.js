import { generateQuestion } from './questionGenerator.js';
import { fetchFromAPI } from './api.js';
import { fetchExplanationImage } from './explanationImageService.js';

export class Quiz {
    constructor() {
        this.currentQuestion = null;
        this.score = 0;
        this.timer = null;
        this.timeLimit = 0;
        this.questionLimit = 0;
        this.questionsAnswered = 0;
        this.wrongAnswers = 0;
        this.difficulty = '';
    }

    async generateQuestion(subject) {
        if (this.questionLimit && this.questionsAnswered >= this.questionLimit) {
            return null;
        }

        return await generateQuestion(subject, this.difficulty);
    }

    async getExplanation(question, options, correctIndex) {
        const prompt = `
        For this ${this.difficulty.toLowerCase()} level medical question and its options:
        Question: "${question}"
        Options: ${options.map((opt, i) => `${i + 1}. ${opt}`).join(', ')}
        Correct Answer: ${options[correctIndex]}

        Please provide a point-wise explanation in this exact format:
        CORRECT ANSWER (${options[correctIndex]}):
        • Point 1 about why it's correct
        • Point 2 about why it's correct

        WHY OTHER OPTIONS ARE INCORRECT:
        ${options.map((opt, i) => i !== correctIndex ? `${opt}:
        • Point 1 why it's wrong
        • Point 2 why it's wrong` : '').filter(Boolean).join('\n\n')}

        Also provide a brief description of a medical diagram or image that would help explain this concept.
        IMAGE DESCRIPTION:
        `;

        try {
            const explanation = await fetchFromAPI(prompt);
            const parts = explanation.split('IMAGE DESCRIPTION:');
            const textExplanation = parts[0].trim();
            const imageDescription = parts[1]?.trim();

            let imageUrl = null;
            if (imageDescription) {
                imageUrl = await fetchExplanationImage(imageDescription);
            }

            return {
                text: textExplanation,
                imageUrl: imageUrl
            };
        } catch (error) {
            return {
                text: 'Failed to load explanation.',
                imageUrl: null
            };
        }
    }

    async getLearningObjectives(question, answer, explanation) {
        const prompt = `
        For this ${this.difficulty.toLowerCase()} level medical question:
        Question: "${question}"
        Correct Answer: ${answer}
        Explanation: "${explanation}"

        Based on the question, correct answer and explanation, determine the most suitable learning objective from the following:
        1. Key points to remember (2-3 bullet points) or
        2. A relevant formula or equation or
        3. A small table (if applicable) or
        4. A brief flowchart or mind map description or
        5. One flashcard-style quick fact

        Select only one of the above that is most appropriate for this question and present it fully formatted in HTML with the appropriate tags (<ul>, <table>, etc.).
        Ensure the structure is well-formed and useful for learning.
        `;

        try {
            const response = await fetchFromAPI(prompt);
            return {
                content: response.trim()
            };
        } catch (error) {
            return {
                content: '<p>Failed to load the learning objective.</p>'
            };
        }
    }

    async askDoubt(doubt, question) {
        const prompt = `
        Regarding this ${this.difficulty.toLowerCase()} level medical question:
        "${question}"

        User's doubt: "${doubt}"

        Please provide a clear, detailed explanation addressing this specific doubt in the context of the question.
        Focus on medical accuracy and explain in a way that's helpful for medical students.

        Also suggest if a medical diagram or image would be helpful, and if so, describe what it should show.
        IMAGE DESCRIPTION:
        `;

        try {
            const response = await fetchFromAPI(prompt);
            const parts = response.split('IMAGE DESCRIPTION:');
            const textAnswer = parts[0].trim();
            const imageDescription = parts[1]?.trim();

            let imageUrl = null;
            if (imageDescription) {
                imageUrl = await fetchExplanationImage(imageDescription);
            }

            return {
                text: textAnswer,
                imageUrl: imageUrl
            };
        } catch (error) {
            return {
                text: 'Failed to get answer. Please try again.',
                imageUrl: null
            };
        }
    }

    getResults() {
        return {
            total: this.questionsAnswered,
            correct: this.score,
            wrong: this.wrongAnswers,
            percentage: this.questionsAnswered > 0 
                ? Math.round((this.score / this.questionsAnswered) * 100) 
                : 0
        };
    }
}
