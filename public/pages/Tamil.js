function call(){
    window.location.href = "http://localhost:5000/pages/uri.html"
}

function speak(text) {
  if (!('speechSynthesis' in window)) {
    alert('Sorry, your browser does not support speechSynthesis.');
    return;
  }

  // Stop any ongoing speech
  speechSynthesis.cancel();

  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'en-IN';   // Indian English
  utter.rate = 1;
  utter.pitch = 1;
  utter.volume = 1;

  // Wait for voices to load before choosing
  const voices = speechSynthesis.getVoices();
  if (voices.length === 0) {
    // voices might not be ready yet — wait for them
    speechSynthesis.onvoiceschanged = () => setFemaleVoice(utter);
  } else {
    setFemaleVoice(utter);
  }

  function setFemaleVoice(utter) {
    const availableVoices = speechSynthesis.getVoices();

    // Try to find a female-sounding English (India) voice
    const femaleVoice =
      availableVoices.find(v =>
        (v.lang === 'en-IN' || v.lang.startsWith('en')) &&
        (v.name.toLowerCase().includes('female') ||
         v.name.toLowerCase().includes('woman') ||
         v.name.toLowerCase().includes('google') ||
         v.name.toLowerCase().includes('natural'))
      );

    if (femaleVoice) {
      utter.voice = femaleVoice;
      console.log('🎙 Using female voice:', femaleVoice.name);
    } else {
      console.warn('⚠️ No female voice found — using default.');
    }

    speechSynthesis.speak(utter);
  }
  let tamilword = "அம்மா"
  for(let i = 0; i <tamilword.length; i++){
    console.log(tamilword.charAt(i))
  }
  for(let char of tamilword){
      
  }
}


      function amma() {
    speak("Am'māā")
}

async function speakTamil() {
  const text = document.getElementById("tamilText")?.textContent?.trim();
  if (!text) return alert("No Tamil text found!");

  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "ta-IN";

  // Wait for all voices to load
  const voices = await new Promise(resolve => {
    let v = speechSynthesis.getVoices();
    if (v.length) return resolve(v);
    speechSynthesis.onvoiceschanged = () => resolve(speechSynthesis.getVoices());
  });

  // Try to find any Google Tamil voice
  const tamilVoice = voices.find(v =>
    v.lang === "ta-IN" ||
    v.name.toLowerCase().includes("tamil") ||
    v.name.toLowerCase().includes("google தமிழ்")
  );

  if (tamilVoice) {
    utter.voice = tamilVoice;
    console.log("✅ Using voice:", tamilVoice.name);
  } else {
    console.warn("⚠️ Tamil voice not found — using default voice.");
  }

  speechSynthesis.speak(utter);
}
