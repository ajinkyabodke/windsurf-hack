"use server";

import { FitnessOutput, type FitnessInput } from "@/lib/zod-types";
import { openai } from "@ai-sdk/openai";
import { generateText, tool } from "ai";

export const analyzeConversation = async (input: FitnessInput) => {
  const { goal, transcript, activities } = input;
  console.log(JSON.stringify(input));

  const { text, toolCalls } = await generateText({
    model: openai("gpt-4o"),
    temperature: 0.7,
    system: `You are a helpful AI assistant that can answer questions and help with cycling training. Infer the goal of the user from the transcript if not provided. Mark the rest days with 0 values. Today is 1st April 2025.`,
    // maxSteps: 1,
    tools: {
      createPlan: tool({
        parameters: FitnessOutput,
        execute: async (newPlan) => {
          console.log(`[CREATE PLAN]: ${JSON.stringify(newPlan)}`);
          return newPlan;
        },
      }),
      // updatePlan: tool({
      //   parameters: FitnessOutput,
      //   execute: async (updatedPlan) => {
      //     console.log(`[UPDATE PLAN]: ${JSON.stringify(updatedPlan)}`);
      //     return updatedPlan;
      //   },
      // }),
    },

    messages: [
      {
        role: "user",
        content: `
${goal && `User Goal: ${goal.name}`}

${
  activities &&
  activities.length > 0 &&
  `User Activities
${JSON.stringify(activities)}`
}

---

Today's conversation with the user:
${transcript}
`,
      },
    ],
  });

  console.log({
    text,
    toolCalls,
  });

  const result = toolCalls?.[0]?.args;

  if (!result) {
    throw new Error("No result from tool call");
  }

  return { text, toolCalls, result };
};
