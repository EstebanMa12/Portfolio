import { signOut } from "@/app/admin/login/actions";
import { Button } from "@/components/ui/button";

type AdminHeaderActionsProps = {
  email: string;
};

export function AdminHeaderActions({ email }: AdminHeaderActionsProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="hidden sm:inline text-sm text-muted-foreground">{email}</span>
      <form action={signOut}>
        <Button type="submit" variant="outline" size="sm">
          Cerrar sesión
        </Button>
      </form>
    </div>
  );
}
