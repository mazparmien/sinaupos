import React from "react";

export default function AuthLayout({ children }) {
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center 
      bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/assets/images/bg-auth.jpg')", // ubah sesuai gambar kamu
      }}
    >
      <div className="w-[480px] bg-white rounded-3xl shadow-2xl p-10 backdrop-blur-sm">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <div className="w-[50px] h-[50px] rounded-full bg-gradient-to-r from-[#4C3BCF] to-[#3572EF] flex items-center justify-center text-white font-bold text-xl mr-2">
            P
          </div>
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#4C3BCF] to-[#3572EF]">
            PadiPos
          </h1>
        </div>

        {/* Page Content */}
        {children}
      </div>
    </div>
  );
}
