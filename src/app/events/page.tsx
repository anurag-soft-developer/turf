import ComingSoon from "@/components/features/ComingSoon";
import ProtectedPage from "@/guards/ProtectedPage";

const page = () => {
  return (
    <ProtectedPage>
      <ComingSoon pageName="Events" />
    </ProtectedPage>
  );
};

export default page;
