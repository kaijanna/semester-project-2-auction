export function RegisterForm() {
  return `
    <div class="bg-white shadow-md rounded-xl p-8 w-full max-w-md mx-auto">
      <div class="flex justify-center mb-4">
        <img src="./assets/images/logoiconcrow.png" alt="Crow icon" class="h-10 w-auto" />
      </div>

      <h2 class="text-center font-poppins font-semibold text-lg text-[#111827]">
        Create account
      </h2>

      <form id="registerForm" class="space-y-4 mt-6">
       
        <div>
          <label class="block text-sm mb-1 text-[#6B7280]">Username</label>
          <input 
            type="text"
            name="username"
            placeholder="Username must be at least 3 characters"
            class="w-full border border-[#E5E7EB] rounded-md p-2"
          />
        </div>

        <div>
          <label for="email" class="block text-sm mb-1 text-[#6B7280]">Email</label>
          <input 
            id="email"
            type="email"
            name="email"
            placeholder="Must be a valid @stud.noroff.no email"
            class="w-full border border-[#E5E7EB] rounded-md p-2 text-sm font-inter"
          />
        </div>

        <div>
          <label class="block text-sm mb-1 text-[#6B7280]">Password</label>
          <input 
            type="password"
            name="password"
            placeholder="Minimum 8 characters"
            class="w-full border border-[#E5E7EB] rounded-md p-2 text-sm font-inter"
          />
        </div>

          <button type="submit" class="btn-primary w-full">
             Register
          </button>

        <p class="text-center text-sm mt-2">
          Already have an account?
          <a href="#/login" class="text-[#111827] font-medium hover:underline">
            Login
          </a>
        </p>
        
      </form>
      <div id="registerMessage" class="mt-4 text-sm text-center"></div>
    </div>
  `;
}