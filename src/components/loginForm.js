export function LoginForm() {
  return `
    <div class="bg-white shadow-md rounded-xl p-8 w-full max-w-md mx-auto">
      <div class="flex justify-center mb-4">
        <img src="./assets/images/logoiconcrow.png" alt="Crow icon" class="h-10 w-auto" />
      </div>

      <h2 class="text-center font-poppins font-semibold text-lg text-[#111827]">
        Log in to your account
      </h2>

      <form id="loginForm" class="space-y-4 mt-6">
        <div>
          <label for="email" class="block text-sm mb-1 text-[#6B7280]">Email</label>
          <input 
            id="email"
            type="email"
            name="email"
            placeholder="Enter your @stud.noroff.no email"
            class="w-full border border-[#E5E7EB] rounded-md p-2 text-sm font-inter"
          />
        </div>

       <div>
  <label class="block text-sm mb-1 text-[#6B7280]">Password</label>

  <div class="relative">
    <input
      id="password"
      type="password"
      name="password"
      placeholder="Your password"
      class="w-full border border-[#E5E7EB] rounded-md p-2 pr-10 text-sm font-inter"
    />

    <button
  type="button"
  id="toggle-password"
  class="absolute inset-y-0 right-3 flex items-center text-[#6B7280]"
   >
    <i data-lucide="eye" class="w-5 h-5"></i>
   </button>
  </div>
</div>

            <button type="submit" class="btn-primary w-full">
              Login
             </button>

        <p class="text-center text-sm mt-2">
          Don’t have an account?
          <a href="#/register" class="text-[#111827] font-medium hover:underline">
            Register
          </a>
        </p>
      </form>

      <div id="loginMessage" class="mt-4 text-sm text-center"></div>
    </div>
  `;
}
