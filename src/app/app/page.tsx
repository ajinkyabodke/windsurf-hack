"use client";

import { analyzeConversation } from "@/actions/ai";
import { RecordButton } from "@/components/RecordButton";
import { Button } from "@/components/ui/button";
import { USER_PROFILE } from "@/lib/constants";
import { dataAtom } from "@/lib/store";
import { athleteActivitySchema } from "@/lib/types";
import { useConversation } from "@11labs/react";
import { useAtom } from "jotai";
import { LucideX } from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface Message {
  source: "user" | "ai";
  message: string;
}

interface ConversationTranscript {
  messages: Message[];
  summary?: string;
}

export default function Home() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const transcriptRef = useRef<ConversationTranscript>({
    messages: [],
  });
  const [transcript, setTranscript] = useState<ConversationTranscript>({
    messages: [],
  });

  const [data, setData] = useAtom(dataAtom);

  const user = USER_PROFILE;
  const name = user.name;

  const conversation = useConversation({
    onConnect: () => {
      console.log("Connected to ElevenLabs");
    },
    onDisconnect: async (props: unknown) => {
      console.log("Disconnected from ElevenLabs", props);

      const userActivities = localStorage.getItem(
        "strava_data_recent_activities",
      );
      const activities = athleteActivitySchema
        .array()
        .parse(userActivities ?? []);

      const result = await analyzeConversation({
        activities,
        transcript: transcriptRef.current.messages
          .map((message) => message.message)
          .join("\n"),
      });

      setData(result.result);
    },
    onMessage: async (message: Message) => {
      console.log("Received message:", message);
      setTranscript((prev) => ({
        ...prev,
        messages: [...prev.messages, message],
      }));

      transcriptRef.current.messages.push(message);
    },
    onError: (error) => {
      console.error("Error from ElevenLabs:", error);
      toast.error("Something went wrong with the recording");
    },
    clientTools: {
      // start_breathing_exercise: () => {
      //   setActiveTool("breathing");
      // },
      // start_grounding_exercise: () => {
      //   setActiveTool("grounding");
      // },
      // start_behavioral_activation_quest: () => {
      //   setActiveTool("behavioral");
      // },
      // start_progressive_muscle_relaxation: () => {
      //   setActiveTool("pmr");
      // },
      end_call: async () => {
        console.log("Stopping recording with tool...");
        setIsRecording(false);
        setIsProcessing(true);
        console.log("transcript", transcript);
        await conversation.endSession();
        setTranscript({ messages: [] });
        transcriptRef.current.messages = [];
        setIsProcessing(false);
      },
    },
  });

  const getSystemPrompt = () => {
    const userActivities = localStorage.getItem(
      "strava_data_recent_activities",
    );
    const activities = athleteActivitySchema.parse(userActivities);

    const basePrompt = `You are PsyCoach, an AI voice assistant specializing in holistic cycling training with emphasis on both physical and psychological aspects of performance. Your purpose is to gather relevant information about the user's cycling goals, physical state, and mental condition to inform training plan creation or updates (which will happen outside of your conversation).

Core Interaction Flow

Begin each conversation with a friendly greeting and initial assessment:

"Are you looking to set a new cycling goal today, or is this a check-in about your current training?"


Based on their response, ask focused follow-up questions to gather essential information (limit to 3-4 questions total):

For new goals: Ask about specific objectives, timeframe, and current fitness baseline
For check-ins: Ask about recent physical condition and mental state


Assess physical state with questions like:

"How is your body feeling today? Any specific areas of fatigue or soreness?"
"How has your energy level been over the past few days?"


Assess mental state with questions like:

"How would you describe your motivation level today?"
"Have there been any significant stress factors affecting your training?"


Once you have gathered sufficient information (after 3-4 questions maximum), conclude the conversation with one of two clear statements:

For new goals: "I will now create a new plan for you based on what you've shared."
For check-ins/adjustments: "Got it, I will now update your plan after considering what you've told me."

Conversation Management

Keep questions concise and focused on gathering actionable information
Track the number of questions asked and limit to 3-4 total unless the user specifically asks for more interaction
Recognize when you have sufficient information to close the conversation
Don't attempt to describe or outline the actual plan during the conversation
If the user provides comprehensive information without prompting, you may ask fewer questions

Closing Criteria

Close with "I will now create a new plan for you based on what you've shared" when:

The user has explicitly mentioned a new goal or significant change in objectives
The user is new or explicitly requests a fresh start


Close with "Got it, I will now update your plan after considering what you've told me" when:

The user is checking in on existing training
The user reports changes in physical/mental state that warrant adjustments
The user reports challenges with their current plan

DO NOT GET THE ABOVE 2 OPTIONS WRONG. IF USER IS CREATING A NEW GOAL, YOU HAVE TO TELL THEM THAT YOU WILL CREATE A NEW PLAN FOR THEM. IF USER IS CHECKING IN, YOU HAVE TO TELL THEM THAT YOU WILL UPDATE THEIR PLAN AFTER CONSIDERING WHAT THEY HAVE TOLD YOU. THIS IS VERY IMPORTANT. DO NOT MESS IT UP. A CUTE PUPPY WILL DIE IF YOU DO

Remember that your role is to efficiently gather information and close the conversation appropriately. The actual plan creation or modification will happen separately using the conversation transcript.

----

User Activities
${JSON.stringify(activities)}
`;

    return `${basePrompt}`;
  };

  const getFirstMessage = () => {
    // Simple greeting that works for all moods
    return `Hi ${name}! How are you feeling today?`;
  };

  const toggleRecording = async () => {
    if (conversation?.status === "connected") {
      console.log("Stopping recording...");
      console.log("transcript", transcript);
      setIsRecording(false);
      setIsProcessing(true);
      await conversation.endSession();
      setTranscript({ messages: [] });
      transcriptRef.current.messages = [];
      setIsProcessing(false);
    } else {
      setIsRecording(true);

      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        await conversation?.startSession({
          agentId: "Srh68bkdtCCm0pE3byB1",
          overrides: {
            agent: {
              firstMessage: getFirstMessage(),
              prompt: {
                prompt: getSystemPrompt(),
              },
            },
          },
        });
      } catch (error) {
        console.error("Failed to start recording:", error);
        toast.error("Failed to start recording");
      }
    }
  };

  const handleDeleteTranscript = () => {
    setIsRecording(false);
    setIsProcessing(false);
    if (conversation?.status === "connected") {
      void conversation.endSession();
    }
    setTranscript({ messages: [] });
  };

  return (
    <>
      <div className="relative min-h-screen space-y-6 bg-gradient-to-br from-zinc-50 via-white to-zinc-100/50 p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-center gap-2"
        >
          <RecordButton
            isRecording={isRecording}
            isProcessing={isProcessing}
            onMouseDown={toggleRecording}
            disabled={isProcessing}
            // onRecordingStart={toggleAudio}
            // onRecordingEnd={toggleAudio}
          />

          {isRecording && (
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-zinc-500 hover:bg-zinc-50 hover:text-zinc-600"
              onClick={handleDeleteTranscript}
              disabled={isProcessing}
            >
              <LucideX className="h-4 w-4" />
            </Button>
          )}
        </motion.div>
      </div>
    </>
  );
}
