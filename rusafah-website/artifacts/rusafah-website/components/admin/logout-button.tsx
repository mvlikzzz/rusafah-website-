import { logout } from "@/modules/admin/auth-actions";

export function LogoutButton() {
  return (
    <form action={logout}>
      <button
        type="submit"
        className="text-gold-700 hover:text-brown-800 text-sm underline-offset-4 hover:underline"
      >
        تسجيل الخروج
      </button>
    </form>
  );
}
