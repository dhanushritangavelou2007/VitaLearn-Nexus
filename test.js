fetch("https://vitalearn-nexus-backend.vercel.app/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: "teacher@vitalearn.ai", password: "VitaLearn2026!X" })
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
