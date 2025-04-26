"use server";

import { type FitnessInput } from "@/lib/zod-types";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

export const analyzeConversation = async (input: FitnessInput) => {
  const { current_data, current_plan, goal, transcript } = input;

  const { text } = await generateText({
    model: openai("gpt-4o-mini"),
    prompt: `You are a helpful assistant that can answer questions and help with tasks.`,
    messages: [
      {
        role: "user",
        content: transcript,
      },
    ],
  });
};
