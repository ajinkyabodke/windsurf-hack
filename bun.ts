import { analyzeConversation } from "@/actions/ai";

const result = await analyzeConversation({
  transcript:
    "Hi Ajinkya! How can I help you today?\nHi, please help me transform my Himalayan race in August.\nThat sounds like an exciting goal! To help you prepare effectively for your Himalayan race in August, could you tell me a bit about your current fitness level and cycling experience? Also, what kind of training have you been doing recently, and what are your specific goals for the race?\n\nThanks, Mai.\n...\nYeah, I need to prepare for it. I'm very serious about it. So bye.\nOkay, good luck with your race!",
});

console.log(result);
