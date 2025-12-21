'use client';

import { useChat } from '@ai-sdk/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Waves, Send, Info, Sun, Shield, MapPin, Sparkles } from 'lucide-react';
import { useEffect, useRef } from 'react';

const SUGGESTED_QUESTIONS = [
    { text: '¿Mejor spot para principiantes?', icon: <Sun className="h-4 w-4" /> },
    { text: '¿Cómo llegar a Punta Roca?', icon: <MapPin className="h-4 w-4" /> },
    { text: '¿Qué tabla recomiendas para El Sunzal?', icon: <Waves className="h-4 w-4" /> },
    { text: 'Consejos de seguridad en La Bocana', icon: <Shield className="h-4 w-4" /> },
];

export default function AIAdvicePage() {
    // @ts-ignore - types vary between @ai-sdk/react versions
    const { messages, input, setInput, handleInputChange, handleSubmit, isLoading } = useChat();
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            const scrollAreaElement = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
            if (scrollAreaElement) {
                scrollAreaElement.scrollTop = scrollAreaElement.scrollHeight;
            }
        }
    }, [messages, isLoading]);

    const handleSuggestedClick = (text: string) => {
        setInput(text);
    };

    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gradient-to-br from-[#00D4D4] via-[#00B8B8] to-[#FF6B35] p-4 font-sans">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJ3YXZlcyIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjEwMCIgaGVpZ2h0PSI1MCI+PHBhdGggZD0iTTAgMjVRMjUgMCA1MCAyNVQxMDAgMjUiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCN3YXZlcykiLz48L3N2Zz4=')] opacity-10 pointer-events-none" />

            <Card className="w-full max-w-2xl border-none bg-white/90 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:shadow-3xl overflow-hidden">
                <CardHeader className="border-b bg-white/50 pb-4">
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-[#00D4D4] to-[#00B8B8] text-white shadow-lg animate-pulse">
                                <Waves className="h-6 w-6" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-[#0E225C]">Expert AI Advisor</h1>
                                <p className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                                    <span className="h-2 w-2 rounded-full bg-emerald-500"></span> Online
                                </p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" className="text-muted-foreground rounded-full h-8 w-8">
                            <Info className="h-5 w-5" />
                        </Button>
                    </CardTitle>
                </CardHeader>

                <CardContent className="p-0">
                    <ScrollArea ref={scrollRef} className="h-[55vh] p-6 lg:h-[60vh]">
                        <div className="space-y-6">
                            {messages.length === 0 && (
                                <div className="flex flex-col items-center justify-center space-y-4 py-8 text-center">
                                    <div className="rounded-full bg-primary/10 p-4">
                                        <Sparkles className="h-8 w-8 text-primary" />
                                    </div>
                                    <div className="space-y-2">
                                        <h2 className="text-lg font-bold text-[#0E225C]">¡Aloha! Soy tu guía de Surf City</h2>
                                        <p className="max-w-xs text-sm text-muted-foreground">
                                            Pregúntame sobre las mejores olas de El Salvador, recomendaciones de equipo o consejos de seguridad.
                                        </p>
                                    </div>

                                    <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                                        {SUGGESTED_QUESTIONS.map((q, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleSuggestedClick(q.text)}
                                                className="flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 p-3 text-left text-xs font-medium transition-all hover:bg-primary/10 hover:border-primary/40 active:scale-95"
                                            >
                                                <span className="text-primary">{q.icon}</span>
                                                {q.text}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {messages.map((m) => (
                                <div
                                    key={m.id}
                                    className={`flex animate-in fade-in slide-in-from-bottom-2 duration-300 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`relative group max-w-[85%] rounded-2xl px-5 py-3 shadow-md transition-all ${m.role === 'user'
                                            ? 'bg-gradient-to-r from-[#00D4D4] to-[#00B8B8] text-white rounded-tr-none'
                                            : 'bg-slate-100 text-[#0E225C] rounded-tl-none border border-slate-200'
                                            }`}
                                    >
                                        <p className="mb-1 text-[10px] font-bold uppercase tracking-wider opacity-60">
                                            {m.role === 'user' ? 'Tú' : 'Surf Advisor'}
                                        </p>
                                        <div className="prose prose-sm prose-slate dark:prose-invert">
                                            {/* @ts-ignore */}
                                            <p className="whitespace-pre-wrap text-sm leading-relaxed">{m.content}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-slate-100 rounded-2xl rounded-tl-none px-5 py-3 text-sm flex items-center gap-2 text-[#0E225C]/70 italic border border-slate-200 shadow-sm">
                                        <div className="flex gap-1">
                                            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></span>
                                        </div>
                                        El instructor está pensando...
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </CardContent>

                <CardFooter className="border-t bg-white/50 p-4">
                    <form onSubmit={handleSubmit} className="flex w-full items-center gap-3">
                        <div className="relative flex-1">
                            <Input
                                value={input}
                                onChange={handleInputChange}
                                placeholder="Escribe tu pregunta aquí..."
                                className="h-12 w-full rounded-2xl border-slate-200 bg-white/80 pr-12 focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/60 shadow-inner"
                                disabled={isLoading}
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <Sparkles className={`h-5 w-5 transition-all ${input ? 'text-primary scale-110 opacity-100' : 'text-slate-300 opacity-0'}`} />
                            </div>
                        </div>
                        <Button
                            type="submit"
                            disabled={isLoading || !(input || '').trim()}
                            className="h-12 w-12 rounded-2xl bg-gradient-to-r from-[#0E225C] to-[#1E73BE] p-0 shadow-lg transition-all hover:scale-105 hover:shadow-primary/20 active:scale-95 shrink-0"
                        >
                            <Send className="h-5 w-5 text-white" />
                        </Button>
                    </form>
                </CardFooter>
            </Card>
        </div>
    );
}
