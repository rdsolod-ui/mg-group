import Experience from "@/components/Experience";
import { structuredData } from "@/data/site-metadata";
export default function Page() {
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
    <Experience />
  </>;
}
