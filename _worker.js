export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // CORS Headers enable kar rahe hain taaki request mein koi blockage na ho
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (url.pathname === "/api/chat" && request.method === "POST") {
      try {
        const { prompt } = await request.json();
        const apiKey = "AQ.Ab8RN6I-QcdVLfnvHlymKmNHBFE3rs6tyatzihWo7Dlvu1o4YQ";

        const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        });

        const data = await geminiRes.json();
        
        if (data.error) {
          return new Response(JSON.stringify({ reply: "Gemini API Error: " + data.error.message }), { headers: corsHeaders });
        }

        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "AI response generate nahi ho paya.";

        return new Response(JSON.stringify({ reply }), { headers: corsHeaders });
      } catch (err) {
        return new Response(JSON.stringify({ reply: "Worker Catch Error: " + err.message }), { headers: corsHeaders });
      }
    }

    return env.ASSETS.fetch(request);
  }
};
