"use server";

import { FitnessOutput, type FitnessInput } from "@/lib/zod-types";
import { openai } from "@ai-sdk/openai";
import { generateText, tool } from "ai";

export const analyzeConversation = async (input: FitnessInput) => {
  const { current_data, current_plan, goal, transcript } = input;

  console.log(JSON.stringify(input));

  const { text, toolCalls } = await generateText({
    model: openai("gpt-4o"),
    temperature: 0.7,
    system: `You are a helpful assistant that can answer questions and help with cycling training. Infer the goal of the user from the transcript if not provided. Mark the rest days with 0 values.
    
Today is ${new Date().toISOString().split("T")[0]}.`,

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
