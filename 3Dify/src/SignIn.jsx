export default function SignIn() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-sm border border-gray-700 p-8 rounded-lg">
        
        <h1 className="text-3xl font-mono mb-6">Sign In</h1>

        <form className="flex flex-col space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="bg-black border border-gray-700 text-white px-4 py-2 rounded focus:outline-none focus:border-white"
          />

          <input
            type="password"
            placeholder="Password"
            className="bg-black border border-gray-700 text-white px-4 py-2 rounded focus:outline-none focus:border-white"
          />

          <button
            className="border border-white py-2 rounded hover:bg-white hover:text-black transition font-mono"
            type="submit"
          >
            Sign In →
          </button>
        </form>

        <p className="text-sm text-gray-400 mt-6 text-center">
          Don't have an account?
          <a href="/register" className="underline ml-1">Register</a>
        </p>
      </div>
    </div>
  );
}
