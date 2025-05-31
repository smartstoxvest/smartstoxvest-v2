import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, PartyPopper } from "lucide-react";

const ThankYou = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center text-center px-4">
      <div className="text-5xl mb-4 animate-bounce">
        <PartyPopper className="inline-block text-blue-500" size={48} />
      </div>
      <h1 className="text-4xl font-bold text-blue-800 mb-4">
        Thank You for Your Feedback!
      </h1>
      <p className="text-gray-700 mb-8 max-w-md">
        Your insights help us improve SmartStoxVest and empower investors around the world. We'll get better because of you!
      </p>
      <Link
        to="/"
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow transition"
      >
        ⬅️ Back to Home
      </Link>
      <div className="mt-10 animate-fade-in-up text-sm text-gray-400">
        <Sparkles className="inline-block mr-1 text-yellow-400" />
        We rise by lifting others.
      </div>
    </div>
  );
};

export default ThankYou;
