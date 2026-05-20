import ComingSoon from "@/components/features/ComingSoon";
import ProtectedPage from "@/guards/ProtectedPage";
import { redirect } from "next/navigation";

const page = () => {
  return redirect("/host/");
  return (
    <ProtectedPage>
      <ComingSoon pageName="Dashboard" />
    </ProtectedPage>
  );
};

export default page;
