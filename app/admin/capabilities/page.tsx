import { readContent } from "@/lib/content-server";
import { requireSession } from "@/lib/auth";
import { CapabilityForm } from "../_forms";
import { deleteCapabilityAction, saveCapabilityAction } from "../actions";

export default async function CapabilitiesPage() {
  await requireSession();

  const content = await readContent();
  const rows = content.capabilities;

  return (
    <>
      <div className="ahead">
        <h1>Capabilities</h1>
        <p className="ahead__sub">Each row becomes one group in the Capabilities table.</p>
      </div>

      <div className="panels">
        {rows.map((row) => (
          <CapabilityForm
            key={row.id}
            action={saveCapabilityAction}
            capability={{ id: row.id, group: row.group, items: row.items }}
            deleteAction={deleteCapabilityAction.bind(null, row.id)}
          />
        ))}

        <CapabilityForm action={saveCapabilityAction} />
      </div>
    </>
  );
}
