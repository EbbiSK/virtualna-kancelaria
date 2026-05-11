import { useEffect, useState } from "react";
import { Building2, UserRound, ImagePlus } from "lucide-react";

type HeaderProps = {
  loggedUserEmail: string | null;
  logout: () => void;
  openAuth: () => void;
};

const COMPANY_NAME_KEY = "virtual-office-company-name";
const COMPANY_LOGO_KEY = "virtual-office-company-logo";

export default function Header({
  loggedUserEmail,
  logout,
  openAuth,
}: HeaderProps) {
  const [companyName, setCompanyName] = useState("Virtuálna kancelária");
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);

  useEffect(() => {
    const savedName = localStorage.getItem(COMPANY_NAME_KEY);

    if (savedName?.trim()) {
      setCompanyName(savedName);
    }

    const savedLogo = localStorage.getItem(COMPANY_LOGO_KEY);

    if (savedLogo) {
      setCompanyLogo(savedLogo);
    }
  }, []);

  const handleLogoUpload = (file: File) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = String(reader.result);

      localStorage.setItem(COMPANY_LOGO_KEY, result);
      setCompanyLogo(result);
    };

    reader.readAsDataURL(file);
  };

  return (
    <header className="flex items-center justify-between border-b border-green-200 bg-white px-10 py-6">
      <div className="flex items-center gap-5">
        <label className="group relative flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-green-300 bg-green-50 transition hover:bg-green-100">
          <input
            type="file"
            accept="image/png,image/jpeg,image/svg+xml"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];

              if (file) {
                handleLogoUpload(file);
              }

              event.target.value = "";
            }}
          />

          {companyLogo ? (
            <img
              src={companyLogo}
              alt="Logo firmy"
              className="h-20 w-20 rounded-xl object-contain"
            />
          ) : (
            <>
              <ImagePlus size={28} className="mb-2 text-green-700" />

              <div className="text-center text-sm font-bold text-green-700">
                VLOŽIŤ
                <br />
                LOGO
              </div>

              <div className="mt-1 text-[10px] text-green-600">
                JPG, PNG, SVG
              </div>
            </>
          )}
        </label>

        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-green-700 p-3 text-white shadow-lg">
            <Building2 size={28} />
          </div>

          <div>
            <div className="text-4xl font-black tracking-tight text-green-800">
              {companyName}
            </div>

            <div className="mt-1 text-sm text-green-600">
              Virtuálne pracovné prostredie
            </div>
          </div>
        </div>
      </div>

      {loggedUserEmail ? (
        <div className="flex items-center gap-4">
          <div className="rounded-2xl border border-green-200 bg-green-50 px-5 py-3 font-semibold text-green-700">
            {loggedUserEmail}
          </div>

          <button
            onClick={logout}
            className="rounded-2xl bg-orange-500 px-6 py-3 font-bold text-white shadow-md transition hover:bg-orange-600"
          >
            Odhlásiť
          </button>
        </div>
      ) : (
        <button
          onClick={openAuth}
          className="flex items-center gap-3 rounded-2xl bg-orange-500 px-6 py-3 font-bold text-white shadow-md transition hover:bg-orange-600"
        >
          <UserRound size={22} />
          Prihlásenie
        </button>
      )}
    </header>
  );
}