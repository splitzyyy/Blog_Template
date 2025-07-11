
  const scriptURL = "https://script.google.com/macros/s/AKfycby9GvG3a670wG-lS_4YgNSrkRo2i9or3SCi2frltQa4G9lQCy40a9vnaeLJaRl_oZz5/exec";

  function submitToGoogleSheet(e) {
    e.preventDefault(); // Prevent default form submission

    const form = document.getElementById("contactForm");
    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const message = document.getElementById("message");
    const feedback = document.getElementById("feedback");

    const allFields = [name, email, message];
    let isValid = true;

    // Clear previous errors
    allFields.forEach(field => {
      field.classList.remove("error", "shake");
    });
    feedback.innerText = "";

    // Basic validation
    allFields.forEach(field => {
      if (field.value.trim() === "") {
        field.classList.add("error", "shake");
        isValid = false;
      }
    });

    // Only allow Gmail
    const isGmail = /^[^@]+@gmail\.com$/i.test(email.value.trim());
    if (!isGmail) {
      email.classList.add("error", "shake");
      feedback.innerText = "Only Gmail addresses are allowed.";
      return;
    }

    if (!isValid) {
      feedback.innerText = "Please fill out all fields.";
      return;
    }

    // Send to Google Sheets
    const formData = new URLSearchParams();
    formData.append("name", name.value.trim());
    formData.append("email", email.value.trim());
    formData.append("message", message.value.trim());

    showNotification("⏳ Sending...", "loading");

  fetch(scriptURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString()
  })
  .then(response => response.json())
  .then(result => {
    if (result.result === "success") {
      form.reset(); // 🟢 Reset first
      showNotification("✅ Message sent successfully!");
    } else {
      showNotification("⚠️ " + (result.message || "Submission failed."), "error");
    }
  })
  .catch(error => {
    console.error("Fetch error:", error);
    showNotification("⚠️ Network error.", "error");
  });
  function showNotification(message, type = "success", callback) {
  const notification = document.getElementById("notification");

  notification.innerText = message;
  notification.className = ""; // Reset
  notification.classList.add("show");

  if (type === "loading") {
    notification.classList.add("loading");
  } else if (type === "error") {
    notification.classList.add("error");
  } else {
    notification.classList.add("success");
  }

  // Remove after 2.5s unless it's loading
  if (type !== "loading") {
    setTimeout(() => {
      notification.classList.remove("show", "loading", "error", "success");
      if (typeof callback === "function") callback();
    }, 2500);
  }
}
  }
