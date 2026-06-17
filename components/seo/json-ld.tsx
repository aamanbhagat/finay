/** Renders one or more JSON-LD structured-data blocks. */
export function JsonLd({ data }: { data: object | object[] }) {
  const json = JSON.stringify(data);
  return (
    <script
      type="application/ld+json"
      // Structured data is build-time/server generated and trusted.
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
