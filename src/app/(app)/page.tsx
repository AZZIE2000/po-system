import dynamic from "next/dynamic";
import { PoTable } from "./_components/po-table";
import { db } from "@/server/db";
import { getServerAuthSession } from "@/server/auth";
const CompaniesPieChart = dynamic(
  () => import("./_components/companies-pie-chart"),
  {
    loading: () => <p>Loading...</p>,
  },
);
export default async function Page() {
  const numberOfCompanies = await db.company.count();
  const session = await getServerAuthSession();
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="p aspect-video rounded-xl bg-muted/50">
          <CompaniesPieChart numberOfCompanies={numberOfCompanies} />
        </div>
        <div className="aspect-video rounded-xl bg-muted/50">
          {JSON.stringify(session)}
        </div>
        <div className="aspect-video rounded-xl bg-muted/50" />
      </div>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
        <PoTable />
      </div>
    </div>
  );
}
