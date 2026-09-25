import { termsKindForApp } from "@/lib/constants/app-type";
import { CurrentTerms } from "./_components/current-terms";

export default function TermsPage() {
  const kind = termsKindForApp();

  return (
    <div className="bg-gray-50 py-8">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900">Terms and conditions</h1>
        {kind ? (
          <CurrentTerms kind={kind} />
        ) : (
          <p className="mt-6 text-gray-600">
            Terms and conditions will be available soon.
          </p>
        )}
      </div>
    </div>
  );
}
