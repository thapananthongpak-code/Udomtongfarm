import { notFound } from "next/navigation";

// Any address that no other page claims ends up here and shows the "not found" page.
export default function UnknownPage() {
  notFound();
}
