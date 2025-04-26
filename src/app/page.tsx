"use client";

import { RecordButton } from "@/components/RecordButton";
import { Button } from "@/components/ui/button";
import { USER_PROFILE } from "@/lib/constants";
import { useConversation } from "@11labs/react";
import { LucideX } from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";

type Mood = {
  id: string;
  label: string;
  description: string;
  prompt: string;
};

type MoodValue = (typeof MOODS)[number]["id"];

const MOODS: Mood[] = [
  {
    id: "vent",
    label: "I need to vent",
    description: "Let it all out",
    prompt: "I am here to listen. Tell me what is bothering you...",
  },
  {
    id: "chat",
    label: "Just chat",
    description: "Have a casual conversation",
    prompt: "How was your day? I would love to hear about it...",
  },
  {
    id: "unwind",
    label: "Help me unwind",
    description: "Relax and reflect",
    prompt: "Let us take a moment to relax. How are you feeling right now?",
  },
];

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
  const user = USER_PROFILE;
  const name = user.name;

  const conversation = useConversation({
    onConnect: () => {
      console.log("Connected to ElevenLabs");
    },
    onDisconnect: (props: unknown) => {
      console.log("Disconnected from ElevenLabs", props);
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
      end_session: async () => {
        console.log("Stopping recording...");
        setIsRecording(false);
        setIsProcessing(true);
        await conversation.endSession();
        setTranscript({ messages: [] });
        transcriptRef.current.messages = [];
        setIsProcessing(false);
      },
    },
  });

  const getSystemPrompt = () => {
    const basePrompt = `Keep the conversation light-hearted and casual while remaining emotionally aware. Engage with the user in a friendly manner, sharing brief, relevant observations that encourage connection. Maintain a natural flow in the conversation without being overly formal or scripted. Ask open-ended questions to guide the dialogue and ensure the user feels heard and valued.    `;

    return `${basePrompt}`;
  };

  const getFirstMessage = () => {
    // Simple greeting that works for all moods
    return `Hi ${name}! How can I help you today?`;
  };

  const toggleRecording = async () => {
    if (conversation?.status === "connected") {
      console.log("Stopping recording...");
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
          agentId: "AupMfEyUGwuMVyOywI6b",
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
