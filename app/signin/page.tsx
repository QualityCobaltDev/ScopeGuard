import { redirect } from "next/navigation";

export default function SignInRedirectPage() {
  redirect("/admin/signin");
}
