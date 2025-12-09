import { Navbar } from "../components/navbar.js";
import { Footer } from "../components/footer.js";
import { LoginForm } from "../components/loginForm.js";

export function LoginPage() {
  return `
    <div class="min-h-screen flex flex-col">
      ${Navbar()}

      <main class="flex-1 w-full">
        <div class="max-w-2xl mx-auto px-4 py-12">
          ${LoginForm()}
        </div>
      </main>

      ${Footer()}
    </div>
  `;
}