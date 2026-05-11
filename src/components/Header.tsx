import { useEffect, useState } from "react";
import { Building2 } from "lucide-react";

type HeaderProps = {
  loggedUserEmail: string | null;
  logout: () => void;
  openAuth: () => void;
};

const COMPANY_NAME_KEY = "virtual-office-company-name";
const COMPANY_LOGO_KEY = "virtual-office-company-logo";
const COMPANY_UPDATED_EVENT = "virtual-office-company-updated";

export default function Header({
  loggedUserEmail,
  logout,
  openAuth,
}: HeaderProps) {
  const [companyName, setCompanyName] = useState("Rentulo");
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);

  useEffect(() => {
    const loadCompany = () => {
      const savedName = localStorage.getItem(COMPANY_NAME_KEY);
      const savedLogo = localStorage.getItem(COMPANY_LOGO_KEY);

      setCompanyName(savedName?.trim() || "Rentulo");
      setCompanyLogo(savedLogo || null);
    };

    loadCompany();

    window.addEventListener(COMPANY_UPDATED_EVENT, loadCompany);
    window.addEventListener("storage", loadCompany);

    return () => {
      window.removeEventListener(COMPANY_UPDATED_EVENT, loadCompany);
      window.removeEventListener("storage", loadCompany);
    };
  }, []);

  return (
    <header className="border-b border-green-100 bg-white px-8 py-3 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-green-700 text-white shadow-md">
            {companyLogo ? (
              <img
                src={companyLogo}
                alt="Logo firmy"
                className="h-10 w-10 object-contain"
              />
            ) : (
              <Building2 size={28} />
            )}
          </div>

          <div className="text-4xl font-black tracking-tight text-green-700">
            {companyName}
          </div>
        </div>

        {loggedUserEmail ? (
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-green-200 bg-green-50 px-5 py-2 text-base font-bold text-green-700">
              {loggedUserEmail}
            </div>

            <button
              onClick={logout}
              className="rounded-2xl bg-orange-500 px-6 py-2 text-base font-black text-white shadow-md transition hover:bg-orange-600"
            >
              Odhlásiť
            </button>
          </div>
        ) : (
          <button
            onClick={openAuth}
            className="rounded-2xl bg-orange-500 px-6 py-2 text-base font-black text-white shadow-md transition hover:bg-orange-600"
          >
            Prihlásenie
          </button>
        )}
      </div>
    </header>
  );
}