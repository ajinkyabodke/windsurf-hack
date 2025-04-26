"use server";

import { FitnessOutput, type FitnessInput } from "@/lib/zod-types";
import { openai } from "@ai-sdk/openai";
import { generateText, tool } from "ai";

export const analyzeConversation = async (input: FitnessInput) => {
  const { current_data, current_plan, goal, transcript } = input;

  const { text, toolCalls } = await generateText({
    model: openai("gpt-4o-mini"),
    prompt: `You are a helpful assistant that can answer questions and help with cycling training.`,

    maxSteps: 3,

    tools: {
      createPlan: tool({
        parameters: FitnessOutput,
        execute: async (input) => {
          console.log(`[CREATE PLAN]: ${JSON.stringify(input)}`);

          return `Updated Plan`;
        },
      }),
    },

    messages: [
      {
        role: "user",
        content: JSON.stringify(input),
      },
    ],
  });

  console.log({
    text,
    toolCalls,
  });

  return { text, toolCalls };
};
