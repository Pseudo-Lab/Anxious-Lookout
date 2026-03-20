import { SITE_NAME } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-stone-200 bg-stone-50">
      <div className="mx-auto max-w-7xl px-6 py-6 text-center text-sm text-stone-400">
        &copy; {new Date().getFullYear()} {SITE_NAME} &middot; Built with curiosity
      </div>
    </footer>
  );
}
