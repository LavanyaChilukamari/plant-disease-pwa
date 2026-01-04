// const API_URL = "http://127.0.0.1:5000/predict";
// const API_URL = "http://192.168.0.109:5000/predict"; // for phone
const API_URL = "/predict"; // SAME ORIGIN – THIS IS THE FIX

const imageInput = document.getElementById("imageInput");
const preview = document.getElementById("preview");
const predictBtn = document.getElementById("predictBtn");

const resultDiv = document.getElementById("result");
const diseaseEl = document.getElementById("disease");
const confidenceEl = document.getElementById("confidence");
const cureEl = document.getElementById("cure");
const preventionEl = document.getElementById("prevention");
const usesEl = document.getElementById("uses");
const summaryEl = document.getElementById("summary");

let userId = localStorage.getItem("user_id");
if (!userId) {
  userId = crypto.randomUUID();
  localStorage.setItem("user_id", userId);
}

imageInput.addEventListener("change", () => {
  preview.src = URL.createObjectURL(imageInput.files[0]);
  preview.hidden = false;
  resultDiv.hidden = true;
});

predictBtn.addEventListener("click", async () => {
  const file = imageInput.files[0];
  if (!file) return alert("Upload image");

  const formData = new FormData();
  formData.append("user_id", userId);
  formData.append("image", file);

  predictBtn.disabled = true;
  predictBtn.innerText = "Analyzing...";

  try {
    const res = await fetch(API_URL, { method: "POST", body: formData });
    const data = await res.json();

    if (res.status === 422) {
      diseaseEl.innerText = "❌ Not a Leaf";
      summaryEl.innerText = data.message;
      resultDiv.hidden = false;
      return;
    }

    diseaseEl.innerText = data.disease;
    confidenceEl.innerText = `Confidence: ${data.confidence}%`;
    cureEl.innerHTML = data.cure.map(c => `<li>${c}</li>`).join("");
    preventionEl.innerHTML = data.prevention.map(p => `<li>${p}</li>`).join("");
    usesEl.innerText = data.leaf_uses;
    summaryEl.innerText = data.summary;
    resultDiv.hidden = false;
  } catch {
    alert("Backend error");
  } finally {
    predictBtn.disabled = false;
    predictBtn.innerText = "Analyze Leaf";
  }
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/service-worker.js");
}
