import { useEffect, useMemo, useState } from "react";
import { format } from "@/i18n";
import { useLang, useT } from "@/i18n/hooks";
import { addDays, endOfMonth, mondayOf, recentMonths, startOfMonth } from "@/lib/dates";
import { formatPrice } from "@/lib/menu";
import { fetchPending, fetchSalesDays, fetchTopItems, salesCsv, sumDays, type SalesDay, type TopItem } from "@/lib/sales";
import { saveBlob } from "@/lib/qr";
import { bangkokToday } from "@/lib/visits";

const MONTHS_BACK = 12;
const WEEKS_BACK = 8;

type State = { days: SalesDay[]; pending: { orders: number; amount: number } | null };

/** How much the café has taken: today, this week, this month, and any of the last twelve months. */
export default function Sales() {
  const lang = useLang();
  const t = useT().admin;
  const labels = t.sales;
  const today = bangkokToday();
  const months = useMemo(() => recentMonths(today, MONTHS_BACK), [today]);
  const [month, setMonth] = useState(months[months.length - 1]);
  const [data, setData] = useState<State | null | "unavailable">(null);
  const [top, setTop] = useState<{ month: string; items: TopItem[] | null } | null>(null);

  const locale = lang === "th" ? "th-TH" : "en-GB";
  const monthName = (day: string) => new Intl.DateTimeFormat(locale, { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${day}T00:00:00Z`));
  const dayName = (day: string) => new Intl.DateTimeFormat(locale, { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" }).format(new Date(`${day}T00:00:00Z`));
  const shortDay = (day: string) => new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", timeZone: "UTC" }).format(new Date(`${day}T00:00:00Z`));

  useEffect(() => {
    let cancelled = false;
    Promise.all([fetchSalesDays(months[0], today), fetchPending()]).then(([days, pending]) => {
      if (!cancelled) setData(days === null ? "unavailable" : { days, pending });
    });
    return () => {
      cancelled = true;
    };
  }, [months, today]);

  useEffect(() => {
    let cancelled = false;
    fetchTopItems(month, endOfMonth(month)).then((items) => {
      if (!cancelled) setTop({ month, items });
    });
    return () => {
      cancelled = true;
    };
  }, [month]);

  if (data === "unavailable") {
    return (
      <>
        <h1 className="display text-4xl md:text-5xl">{labels.title}</h1>
        <p role="alert" className="notice notice-error mt-8 max-w-xl">
          {labels.unavailable}
        </p>
      </>
    );
  }

  const days = data?.days ?? [];
  const within = (from: string, to: string) => days.filter((d) => d.day >= from && d.day <= to);
  const todayTotals = sumDays(within(today, today));
  const weekTotals = sumDays(within(mondayOf(today), today));
  const monthTotals = sumDays(within(startOfMonth(today), today));

  const picked = sumDays(within(month, endOfMonth(month)));
  const byDayInMonth = within(month, endOfMonth(month));
  const lastDay = month === startOfMonth(today) ? today : endOfMonth(month);
  const dailyRows: SalesDay[] = [];
  for (let day = month; day <= lastDay; day = addDays(day, 1)) {
    dailyRows.push(byDayInMonth.find((d) => d.day === day) ?? { day, orders: 0, revenue: 0, cash: 0, promptpay: 0 });
  }
  const biggestDay = Math.max(1, ...dailyRows.map((d) => d.revenue));

  const weeks = Array.from({ length: WEEKS_BACK }, (_, i) => {
    const start = addDays(mondayOf(today), -7 * (WEEKS_BACK - 1 - i));
    const end = addDays(start, 6);
    return { start, end, ...sumDays(within(start, end)) };
  });
  const monthRows = months.map((m) => ({ month: m, ...sumDays(within(m, endOfMonth(m))) })).reverse();

  const cards = [
    { label: labels.today, totals: todayTotals },
    { label: labels.thisWeek, totals: weekTotals },
    { label: labels.thisMonth, totals: monthTotals },
  ];

  const share = (value: number) => (picked.revenue > 0 ? Math.round((value / picked.revenue) * 100) : 0);
  const topItems = top?.month === month ? top.items : null;

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4 print:hidden">
        <div>
          <h1 className="display text-4xl md:text-5xl">{labels.title}</h1>
          <p className="mt-3 max-w-xl text-[0.9375rem] text-muted">{labels.lede}</p>
        </div>
      </div>

      {/* Today, this week, this month */}
      <dl className="mt-8 grid gap-3 sm:grid-cols-3 md:gap-4">
        {cards.map((card) => (
          <div key={card.label} className="card flex flex-col-reverse px-5 py-5">
            <dt className="mt-1 text-[0.875rem] text-muted">
              {card.label} · {format(labels.ordersCount, { n: card.totals.orders })}
            </dt>
            <dd className="text-3xl font-semibold text-accent sm:text-4xl">{data ? formatPrice(card.totals.revenue) : "–"}</dd>
          </div>
        ))}
      </dl>
      {data?.pending && data.pending.orders > 0 && (
        <p className="notice mt-4 print:hidden">{format(labels.pendingNote, { n: data.pending.orders, amount: formatPrice(data.pending.amount) })}</p>
      )}

      {/* One month in detail */}
      <section className="mt-12 border-t border-line pt-8" aria-labelledby="month-detail">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="month-detail" className="text-2xl font-semibold">
              {monthName(month)}
            </h2>
            <label className="mt-3 flex items-center gap-3 print:hidden">
              <span className="text-[0.875rem] text-muted">{labels.month}</span>
              <select className="input !w-auto" value={month} onChange={(event) => setMonth(event.target.value)}>
                {[...months].reverse().map((m) => (
                  <option key={m} value={m}>
                    {monthName(m)}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="flex gap-2 print:hidden">
            <button
              type="button"
              className="btn btn-quiet"
              disabled={!data}
              onClick={() => saveBlob(new Blob([salesCsv(dailyRows)], { type: "text/csv;charset=utf-8" }), `sales-${month.slice(0, 7)}.csv`)}
            >
              {labels.csv}
            </button>
            <button type="button" className="btn btn-primary" onClick={() => window.print()}>
              {labels.print}
            </button>
          </div>
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {[
            { label: labels.revenue, value: formatPrice(picked.revenue), big: true },
            { label: labels.orders, value: String(picked.orders) },
            { label: labels.average, value: picked.orders ? formatPrice(Math.round(picked.revenue / picked.orders)) : "–" },
            {
              label: `${labels.cash} / ${labels.promptpay}`,
              value: picked.revenue ? `${share(picked.cash)}% / ${share(picked.promptpay)}%` : "–",
            },
          ].map((item) => (
            <div key={item.label} className="card flex flex-col-reverse px-4 py-4">
              <dt className="mt-1 text-[0.8125rem] text-muted">{item.label}</dt>
              <dd className={`font-semibold ${item.big ? "text-3xl text-accent" : "text-2xl"}`}>{item.value}</dd>
            </div>
          ))}
        </dl>

        {picked.orders === 0 ? (
          <p className="mt-8 text-muted">{labels.noSales}</p>
        ) : (
          <>
            <h3 className="eyebrow mt-10">{labels.byDay}</h3>
            <ol className="mt-4 max-w-2xl space-y-1.5">
              {dailyRows.map((row) => (
                <li key={row.day} className="grid grid-cols-[6.5rem_1fr_5.5rem] items-center gap-3 text-[0.875rem]">
                  <span className="text-muted">{dayName(row.day)}</span>
                  <span aria-hidden className="h-3 rounded-full bg-wall">
                    <span className="block h-full rounded-full bg-accent" style={{ width: `${(row.revenue / biggestDay) * 100}%` }} />
                  </span>
                  <span className="text-right tabular-nums">
                    {formatPrice(row.revenue)}
                    <span className="sr-only"> · {format(labels.ordersCount, { n: row.orders })}</span>
                  </span>
                </li>
              ))}
            </ol>

            <h3 className="eyebrow mt-10">{labels.topItems}</h3>
            {topItems === null ? (
              <div className="mt-4 h-20 animate-pulse rounded-2xl bg-wall" aria-busy="true" />
            ) : topItems.length === 0 ? (
              <p className="mt-4 text-muted">{labels.noSales}</p>
            ) : (
              <table className="mt-4 w-full max-w-2xl border-collapse text-left text-[0.9375rem]">
                <thead>
                  <tr className="border-b border-line text-[0.8125rem] text-muted">
                    <th className="py-2 pr-4 font-medium">{labels.item}</th>
                    <th className="px-4 py-2 text-right font-medium">{labels.quantity}</th>
                    <th className="py-2 pl-4 text-right font-medium">{labels.amount}</th>
                  </tr>
                </thead>
                <tbody>
                  {topItems.map((item) => (
                    <tr key={item.name_th} className="border-b border-line">
                      <td className="py-2 pr-4">{lang === "th" ? item.name_th : item.name_en || item.name_th}</td>
                      <td className="px-4 py-2 text-right tabular-nums">{item.quantity}</td>
                      <td className="py-2 pl-4 text-right tabular-nums">{formatPrice(item.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
      </section>

      {/* Week by week, month by month */}
      <section className="mt-12 grid gap-10 border-t border-line pt-8 lg:grid-cols-2 print:hidden">
        <div>
          <h2 className="text-xl font-semibold">{labels.byWeek}</h2>
          <table className="mt-4 w-full border-collapse text-left text-[0.9375rem]">
            <tbody>
              {[...weeks].reverse().map((week) => (
                <tr key={week.start} className="border-b border-line">
                  <th scope="row" className="py-2 pr-4 font-normal text-muted">
                    {format(labels.weekOf, { from: shortDay(week.start), to: shortDay(week.end) })}
                  </th>
                  <td className="px-4 py-2 text-right text-muted tabular-nums">{format(labels.ordersCount, { n: week.orders })}</td>
                  <td className="py-2 pl-4 text-right font-semibold tabular-nums">{formatPrice(week.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <h2 className="text-xl font-semibold">{labels.byMonth}</h2>
          <table className="mt-4 w-full border-collapse text-left text-[0.9375rem]">
            <tbody>
              {monthRows.map((row) => (
                <tr key={row.month} className="border-b border-line">
                  <th scope="row" className="py-2 pr-4 font-normal text-muted">
                    <button type="button" className="link" onClick={() => setMonth(row.month)}>
                      {monthName(row.month)}
                    </button>
                  </th>
                  <td className="px-4 py-2 text-right text-muted tabular-nums">{format(labels.ordersCount, { n: row.orders })}</td>
                  <td className="py-2 pl-4 text-right font-semibold tabular-nums">{formatPrice(row.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
