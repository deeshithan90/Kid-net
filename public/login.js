const mn = document.getElementById("mn");
const ps = document.getElementById("ps");

async function login() {
  if (!mn.value || !ps.value) {
    alert("⚠️ Please enter both mobile and password");
    return;
  }

  const loginData = {
    mobile: mn.value.trim(),
    password: ps.value,
  };

  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginData),
    });

    const data = await res.json();

    if (res.ok && data.ok) {
      alert("✅ Login successful! Welcome back.");
      console.log("User:", data.user);
      window.location.href = "http://localhost:5000/home.html"
    } else {
      alert("❌ " + (data.message || "Invalid credentials"));
    }
  } catch (error) {
    console.error("Login error:", error);
    alert("⚠️ Server not responding. Try again later.");
  }
}
