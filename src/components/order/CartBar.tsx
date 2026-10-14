import { Link } from "react-router-dom";
import { format, localePath } from "@/i18n";
import { useLang, useT } from "@/i18n/hooks";
import { formatPrice } from "@/lib/menu";
import { useCart } from "@/state/cart";

/** A bar along the bottom of the menu while the basket has something in it. */
export default function CartBar() {
  const lang = useLang();
  const t = useT().order;
  const { count, total } = useCart();
  if (count === 0) return null;

  return (
    <div className="pop-enter fixed inset-x-3 bottom-3 z-30 flex justify-start print:hidden sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2">
      <Link
        to={localePath(lang, "/order")}
        className="btn btn-primary w-[calc(100%-6rem)] justify-between gap-6 py-3 text-base shadow-[0_14px_30px_-12px_rgb(0_0_0/0.45)] sm:w-auto sm:min-w-80"
      >
        <span>
          {t.viewBasket} · {format(t.basketBar, { n: count })}
        </span>
        <span className="font-semibold">{formatPrice(total)}</span>
      </Link>
    </div>
  );
}
