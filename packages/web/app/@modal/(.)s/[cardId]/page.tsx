import Modal from "@/components/Modal";
import ClientCard from "./ClientCard";

export default async function CardModal({
  params,
}: {
  params: { cardId: string };
}) {
  const { cardId } = params;

  return (
    <Modal>
      <div className="bg-slate-500">
        <ClientCard cardId={cardId} />
      </div>
    </Modal>
  );
}
