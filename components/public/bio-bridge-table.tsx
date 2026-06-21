import type { AboutContent } from "@/lib/schemas/page-content";

type BioBridgeTableProps = {
  rows: AboutContent["bioBridge"];
};

export function BioBridgeTable({ rows }: BioBridgeTableProps) {
  if (rows.length === 0) return null;

  return (
    <>
      <div className="hidden md:block card p-0 overflow-hidden">
        <table className="bridge-table w-full">
          <thead>
            <tr>
              <th scope="col">Bioingeniería</th>
              <th scope="col" className="w-12" aria-hidden="true" />
              <th scope="col">Software</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={`${row.from}-${row.to}`}>
                <td>{row.from}</td>
                <td className="text-center text-text-muted" aria-hidden="true">
                  →
                </td>
                <td>{row.to}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-3">
        {rows.map((row) => (
          <article key={`${row.from}-${row.to}`} className="card py-4 px-5">
            <p className="text-sm font-medium text-accent">{row.from}</p>
            <p className="text-text-muted text-xs my-2" aria-hidden="true">
              ↓
            </p>
            <p className="text-sm text-text-secondary">{row.to}</p>
          </article>
        ))}
      </div>
    </>
  );
}
