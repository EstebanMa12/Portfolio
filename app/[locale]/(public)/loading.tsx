import { getTranslations } from "next-intl/server";
import { AppLoader } from "@/components/ui/app-loader";

export default async function PublicLoading() {
  const t = await getTranslations("common");

  return (
    <AppLoader
      variant="inline"
      label={t("loadingCaption")}
      ariaLabel={t("loading")}
    />
  );
}
