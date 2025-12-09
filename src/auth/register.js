import { registerUser } from "../api/auth.js";

export function setupRegisterForm() {
  const form = document.getElementById("registerForm");
  if (!form) {
    return;
  }

  const messageElement = document.getElementById("registerMessage");

  const submitButton = form.querySelector("button[type='submit']");

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    if (messageElement) {
      messageElement.textContent = "";
      messageElement.className = "mt-4 text-sm text-center";
    }

    const username = form.username.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value.trim().toLowerCase();

    if (username.length < 3) {
      showError("Username must be at least 3 characters.");
      return;
    }

    if (!email.endsWith("@stud.noroff.no")) {
      showError("Email must end with @stud.noroff.no.");
      return;
    }

    if (password.length < 8) {
      showError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const data = await registerUser({
        name: username,
        email: email,
        password: password,
      });

      if (messageElement) {
        messageElement.textContent =
          "Account created successfully! You can now log in.";
        messageElement.className = "mt-4 text-sm text-center text-[#10B981]";
      }

      form.reset();

      setTimeout(() => {
        window.location.hash = "#/login";
      }, 1500);
    } catch (error) {
      showError(error.message);
    } finally {
      setLoading(false);
    }
  });

  function showError(message) {
    if (!messageElement) {
      return;
    }
    messageElement.textContent = message;
    messageElement.className = "mt-4 text-sm text-center text-[#F44344]";
  }

  function setLoading(isLoading) {
    if (!submitButton) {
      return;
    }

    submitButton.disabled = isLoading;
    submitButton.textContent = isLoading ? "Registering..." : "Register";

    if (isLoading) {
      submitButton.classList.add("opacity-70", "cursor-not-allowed");
    } else {
      submitButton.classList.remove("opacity-70", "cursor-not-allowed");
    }
  }
}
