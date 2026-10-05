import { Navigate, useLocation, useParams } from "react-router-dom";
import { localePath } from "@/i18n";
import { useLang } from "@/i18n/hooks";
import { withLocale } from "@/lib/paths";

/** Sends "/" to the visitor's language, e.g. "/th". */
export function RootRedirect() {
  const { search, hash } = useLocation();
  return <Navigate to={withLocale("/") + search + hash} replace />;
}

/** Earlier versions of the site had the department in the address: /species/animal/black-swan. */
export function OldSpeciesAddress() {
  const lang = useLang();
  const { id } = useParams();
  return <Navigate to={localePath(lang, `/species/${id}`)} replace />;
}
