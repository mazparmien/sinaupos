export default function ForgotPassword() {
  return (
    <div className="min-h-screen flex justify-center items-center bg-[url('/assets/images/bg.png')] bg-cover bg-center">
      <div className="w-[600px] h-[644px] bg-white rounded-2xl shadow-lg p-10 flex flex-col justify-center backdrop-blur-sm">     
        <div className="flex items-center justify-center mb-6">
          <div className="w-[50px] h-[50px] rounded-full bg-gradient-to-r from-[#4C3BCF] to-[#3572EF] flex items-center justify-center text-white font-bold text-xl mr-2">
            P
          </div>
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#4C3BCF] to-[#3572EF]">
            PadiPos
          </h1>
        </div>

        <h2 className="text-2xl font-bold text-center mb-2">Reset Password</h2>
        <p className="text-gray-500 text-center mb-6 text-sm">
          Please enter your registered email here!
        </p>

        <form className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Email"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow">
            Submit
          </button>
        </form>

      </div>
    </div>
  );
}
