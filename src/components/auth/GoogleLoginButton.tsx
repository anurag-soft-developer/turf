import ENV_CONFIG from "@/config/env.config";
import { Button } from "../ui/button";
import { FcGoogle } from "react-icons/fc";
const GoogleLoginButton = () => {
  return (
    <>
      <Button
        type="button"
        variant="outline"
        className="w-full cursor-pointer hover:bg-gray-100"
        onClick={() => {
          window.location.href = `${ENV_CONFIG.API_BASE_URL}/auth/google`;
        }}
      >
        <FcGoogle className="mr-2" />
        Continue with Google
      </Button>
    </>
  );
};

export default GoogleLoginButton;
