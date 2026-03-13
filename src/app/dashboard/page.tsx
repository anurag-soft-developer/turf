import ComingSoon from "@/components/features/ComingSoon";
import ProtectedPage from "@/guards/ProtectedPage";

const page = () => {
  return (
    <ProtectedPage>
      <ComingSoon pageName="Dashboard" />
    </ProtectedPage>
  );
};

export default page;
