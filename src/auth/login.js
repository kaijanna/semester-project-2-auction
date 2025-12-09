import { loginUser } from "../api/auth.js";
import { fetchProfile } from "../api/profile.js";

export function setupLoginForm() {
  const form = document.getElementById("loginForm");
  if (!form) {
    return;
  }

  const messageElement = document.getElementById("loginMessage");
  const submitButton = form.querySelector("button[type='submit']");

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    if (messageElement) {
      messageElement.textContent = "";
      messageElement.className = "mt-4 text-sm text-center";
    }

    const emailValue = form.email.value.trim();
    const passwordValue = form.password.value.trim();

    if (!emailValue.endsWith("@stud.noroff.no")) {
      showError("Email must end with @stud.noroff.no.");
      return;
    }

    if (passwordValue.length < 8) {
      showError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const apiData = await loginUser({ email: emailValue, password: passwordValue });

      if (!apiData || !apiData.data) {
        showError("Login failed. Please try again.");
        return;
      }

      let token = null;
      let userName = "";

      const dataUser = apiData.data;

      if (dataUser.name) {
        userName = dataUser.name;
      }

      if (dataUser.accessToken) {
        token = dataUser.accessToken;
      }

      if (!token && apiData.meta && apiData.meta.accessToken) {
        token = apiData.meta.accessToken;
      }

      if (!token) {
        showError("Login failed. Please try again.");
        return;
      }

      let userProfile = null;

      if (token && userName) {
        try {
          userProfile = await fetchProfile(userName, token);
        } catch (profileError) {
          
        }
      }

      let userToStore = apiData.data;
      if (userProfile) {
        userToStore = userProfile;
      }

      const authToStore = {
        user: userToStore,
        token: token,
      };

      localStorage.setItem("auth", JSON.stringify(authToStore));

      if (messageElement) {
        messageElement.textContent = "Logged in successfully!";
        messageElement.className = "mt-4 text-sm text-center text-[#10B981]";
      }

      setTimeout(function () {
        window.location.hash = "#/";
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
    submitButton.textContent = isLoading ? "Logging in..." : "Login";

    if (isLoading) {
      submitButton.classList.add("opacity-70", "cursor-not-allowed");
    } else {
      submitButton.classList.remove("opacity-70", "cursor-not-allowed");
    }
  }
}