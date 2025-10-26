// Get all input fields
const p = document.getElementById("p");
const m = document.getElementById("m");
const k = document.getElementById("k");
const d = document.getElementById("d");
const s = document.getElementById("s");
const l = document.getElementById("l");
const ps = document.getElementById("ps");
const mn = document.getElementById("mn");

let speeck = new SpeechSynthesisUtterance();

// Signup function
async function signup() {
  // Simple front-end validation
  if (
    !p.value ||
    !m.value ||
    !k.value ||
    !d.value ||
    !s.value ||
    !l.value ||
    !ps.value ||
    !mn.value
  ) {
    alert("⚠️ Please fill all fields. before signing up!");
    speak("Please fill all fields. before signing up!")
    return;
  }

  const userData = {
    parent: p.value.trim(),
    kidName: k.value.trim(),
    mail: m.value.trim(),
    dob: d.value,
    school: s.value.trim(),
    location: l.value.trim(),
    password: ps.value,
    mobile: mn.value.trim(),
  };

  try {
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const data = await res.json();

    if (res.ok && data.ok) {
      alert("✅ Signup successful!");
      console.log("User saved:", data.user);
      speak("Signup succesfully")
      window.location.href = "login.html"
    } else {
      alert("❌ " + (data.message || "Signup failed."));
    }
  } catch (error) {
    console.error("Error during signup:", error);
    alert("⚠️ Server connection error. Check console.");
  }
}


function speak(text) {
  if (!('speechSynthesis' in window)) {
    alert('Sorry, your browser does not support speechSynthesis.');
    return;
  }
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'en-IN';       // pick a locale you like
  utter.rate = 1;             // 0.1–10 (1 = normal)
  utter.pitch = 1;            // 0–2
  utter.volume = 1;           // 0–1
  speechSynthesis.cancel();   // stop anything currently speaking
  speechSynthesis.speak(utter);
}