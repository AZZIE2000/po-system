import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { db } from "@/server/db";
import PoForm from "../_components/po-form";
export default async function Page() {
  // const companies = await db.company.findMany();
  // const projects = await db.project.findMany();
  const users = await db.user.findMany();
  return (
    <div className="p-5">
      <Card>
        <CardHeader>
          <CardTitle>Create Purchase Order</CardTitle>
        </CardHeader>
        <CardContent>
          <PoForm users={users} />
        </CardContent>
      </Card>
    </div>
  );
}
