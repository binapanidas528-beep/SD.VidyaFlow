export default {
  async fetch(request, env) {
    const url = new URL(request.url);

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
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "AI response generate nahi ہو paya.";

        return new Response(JSON.stringify({ reply }), {
          headers: { "Content-Type": "application/json" }
        });
      } catch (err) {
        return new Response(JSON.stringify({ reply: "Backend Error: " + err.message }), { status: 500 });
      }
    }

    return env.ASSETS.fetch(request);
  }
};
