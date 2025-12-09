import { Navbar } from "../components/navbar.js";
import { Footer } from "../components/footer.js";
import { RegisterForm } from "../components/registerForm.js";

export function RegisterPage() {
  return `
    <div class="min-h-screen flex flex-col">
      ${Navbar()}

      <main class="flex-1 w-full">
        <div class="max-w-2xl mx-auto px-4 py-12">
          ${RegisterForm()}
        </div>
      </main>

      ${Footer()}
    </div>
  `;
}