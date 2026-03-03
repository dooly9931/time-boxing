"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 bg-warm-white">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold text-gray-800 tracking-tight">
            타임박싱 플래너
          </h1>
          <p className="text-sm text-gray-400">하루를 블록으로 설계하세요</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white rounded-xl border border-beige text-sm font-medium text-gray-700 hover:bg-cream/50 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Google로 계속하기
          </button>

          <button
            disabled
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white rounded-xl border border-beige text-sm font-medium text-gray-300 cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#ccc">
              <path d="M16.27 3H7.73L3 12l4.73 9h8.54L21 12l-4.73-9zM12 15.5a3.5 3.5 0 110-7 3.5 3.5 0 010 7z" />
            </svg>
            Naver (준비 중)
          </button>

          <button
            disabled
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white rounded-xl border border-beige text-sm font-medium text-gray-300 cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#ccc">
              <path d="M12 3C6.48 3 2 6.58 2 11c0 2.83 1.88 5.31 4.68 6.73l-.96 3.57c-.07.26.22.46.44.3L10 19.08c.65.08 1.32.13 2 .13 5.52 0 10-3.58 10-8.01S17.52 3 12 3z" />
            </svg>
            Kakao (준비 중)
          </button>
        </div>

        <p className="text-center text-[11px] text-gray-300">
          로그인하면 기기 간 데이터가 동기화됩니다
        </p>
      </div>
    </div>
  );
}
