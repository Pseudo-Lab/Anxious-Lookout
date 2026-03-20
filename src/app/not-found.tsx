import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <h1 className="text-6xl font-bold text-zinc-300 dark:text-zinc-700">
        404
      </h1>
      <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
        페이지를 찾을 수 없습니다.
      </p>
      <Link
        href="/"
        className="mt-6 text-blue-600 hover:underline"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
