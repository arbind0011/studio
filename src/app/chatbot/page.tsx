
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { nanoid } from 'nanoid';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Bot, User, Volume2, Languages, Plane, Mic } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { getChatbotResponse, ChatbotResponse } from './actions';

const formSchema = z.object({
  message: z.string().min(1, { message: 'Message cannot be empty.' }),
});

type FormValues = z.infer<typeof formSchema>;

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  audioUrl?: string;
  isThinking?: boolean;
}

export default function ChatbotPage() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: '',
    },
  });

  const playAudio = (audioUrl: string) => {
    if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
    }
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const userMessage: Message = { id: nanoid(), text: data.message, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setIsThinking(true);
    form.reset();

    const botThinkingMessage: Message = { id: nanoid(), text: '', sender: 'bot', isThinking: true };
    setMessages((prev) => [...prev, botThinkingMessage]);

    try {
      const result = await getChatbotResponse(data.message);
      if (result.error) {
        throw new Error(result.error);
      }
      
      const botMessage: Message = {
        id: nanoid(),
        text: result.response?.text || 'I am not sure how to respond to that.',
        sender: 'bot',
        audioUrl: result.response?.audioUrl
      };

      setMessages((prev) => prev.map(m => m.isThinking ? botMessage : m));
      
      if (result.response?.audioUrl) {
          playAudio(result.response.audioUrl);
      }

    } catch (error) {
      const err = error as Error;
      toast({ title: 'An error occurred', description: err.message, variant: 'destructive' });
      setMessages((prev) => prev.filter(m => !m.isThinking));
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <AppShell>
      <div className="flex h-[calc(100vh-81px)] flex-col">
        <div className="flex-1 space-y-4 p-4 sm:p-8 pt-6 overflow-hidden">
            <div className="flex items-center justify-between space-y-2">
                <h1 className="text-3xl font-bold tracking-tight font-headline">AI Chatbot</h1>
            </div>
            <Card className="h-[calc(100%-60px)] flex flex-col">
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2">
                        <Bot className="text-primary"/>
                        Your AI Travel Assistant
                    </CardTitle>
                    <CardDescription>
                        Ask me to translate, plan your trip, or find local spots!
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden p-0">
                    <div className="h-full flex flex-col">
                        <ScrollArea className="flex-1 p-6">
                            <div className="space-y-6">
                                {messages.map((msg) => (
                                <div key={msg.id} className={cn('flex items-start gap-3', msg.sender === 'user' && 'justify-end')}>
                                    {msg.sender === 'bot' && (
                                    <Avatar>
                                        <AvatarFallback><Bot /></AvatarFallback>
                                    </Avatar>
                                    )}
                                    <div className={cn('max-w-md rounded-lg p-3 text-sm', msg.sender === 'bot' ? 'bg-muted' : 'bg-primary text-primary-foreground')}>
                                      {msg.isThinking ? (
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                            <div className="h-2 w-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                            <div className="h-2 w-2 bg-current rounded-full animate-bounce"></div>
                                        </div>
                                      ) : (
                                        <p>{msg.text}</p>
                                      )}

                                      {msg.sender === 'bot' && msg.audioUrl && (
                                          <Button variant="ghost" size="icon" className="h-7 w-7 mt-2" onClick={() => playAudio(msg.audioUrl!)}>
                                              <Volume2 className="h-4 w-4" />
                                          </Button>
                                      )}
                                    </div>
                                    {msg.sender === 'user' && (
                                    <Avatar>
                                        <AvatarFallback><User /></AvatarFallback>
                                    </Avatar>
                                    )}
                                </div>
                                ))}
                            </div>
                        </ScrollArea>
                        <div className="p-4 border-t">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center gap-2">
                                    <FormField
                                        control={form.control}
                                        name="message"
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormControl>
                                                    <Input placeholder="Translate 'hello' to Spanish..." {...field} autoComplete="off" />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit" disabled={isThinking}>
                                        <Send className="h-4 w-4" />
                                    </Button>
                                    <Button type="button" variant="outline" disabled>
                                        <Mic className="h-4 w-4" />
                                    </Button>
                                </form>
                            </Form>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
        <audio ref={audioRef} style={{ display: 'none' }} />
      </div>
    </AppShell>
  );
}
