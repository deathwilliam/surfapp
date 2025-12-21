import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages } = await req.json();

    const apiKey = process.env.AI_GATEWAY_API_KEY || process.env.OPENAI_API_KEY;

    // Direct Vercel AI Gateway base URL configuration
    const openai = createOpenAI({
        apiKey,
        baseURL: 'https://ai-gateway.vercel.sh/v1',
    });

    try {
        const result = streamText({
            model: openai('gpt-4o'),
            system: `You are the Expert Surf Advisor for Surf App SV, specializing in El Salvador's "Surf City".
            
            Your knowledge includes:
            - **Main Spots**: El Tunco (La Bocana, El Sunzal), El Zonte (Bitcoin Beach), Punta Roca (La Libertad), El Palmarcito, Mizata, K59, K61, and Wild East spots like Las Flores and Punta Mango.
            - **Conditions**: 
                - Dry Season (Nov-March): Offshore winds, smaller but clean waves (peaks for beginners).
                - Swell Season (April-Oct): Southern swells, big and consistent waves (3ft to 12ft+).
            - **Recommendations**: 
                - Beginners: El Sunzal, Palmarcito, El Tunco (shallow areas).
                - Intermediates: El Zonte, K59.
                - Experts: Punta Roca (world-class right point break), La Bocana (powerful left/right peak).
            - **Culture**: Mention local vibe, "pupusas" after sessions, and "Bitcoin Beach" (El Zonte).
            
            Keep your tone friendly, professional, and full of "aloha" spirit. Help users with board choices (longboards for Sunzal, shortboards for Punta Roca) and safety tips. Answer in the same language the user uses (primarily Spanish or English).`,
            messages,
        });

        // @ts-ignore - The AI SDK result types can be complex between versions
        if (typeof result.toDataStreamResponse === 'function') {
            // @ts-ignore
            return result.toDataStreamResponse();
        }
        // @ts-ignore
        return result.toTextStreamResponse();
    } catch (error) {
        console.error('Error in AI Chat route:', error);
        return new Response(JSON.stringify({ error: 'Failed to generate response' }), { status: 500 });
    }
}
