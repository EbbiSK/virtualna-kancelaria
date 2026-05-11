import { useEffect, useState } from "react";
import { Upload } from "lucide-react";

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
  const [companyName, setCompanyName] = useState("Rentulo");
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
    <header className="border-b border-green-100 bg-white px-10 py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <label className="flex h-[126px] w-[126px] cursor-pointer flex-col items-center justify-center rounded-[28px] border-2 border-dashed border-green-300 bg-green-50 transition hover:bg-green-100">
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
                className="h-20 w-20 object-contain"
              />
            ) : (
              <>
                <Upload size={34} className="mb-2 text-green-700" />

                <div className="text-center text-[16px] font-black text-green-700">
                  VLOŽIŤ
                  <br />
                  LOGO
                </div>

                <div className="mt-2 text-[11px] font-semibold text-green-600">
                  JPG, PNG, SVG
                </div>
              </>
            )}
          </label>

          <div>
            <div className="text-6xl font-black tracking-tight text-green-700">
              {companyName}
            </div>
          </div>
        </div>

        {loggedUserEmail ? (
          <div className="flex items-center gap-4">
            <div className="rounded-2xl border border-green-200 bg-green-50 px-6 py-4 text-xl font-bold text-green-700">
              {loggedUserEmail}
            </div>

            <button
              onClick={logout}
              className="rounded-2xl bg-orange-500 px-8 py-4 text-xl font-black text-white shadow-lg transition hover:bg-orange-600"
            >
              Odhlásiť
            </button>
          </div>
        ) : (
          <button
            onClick={openAuth}
            className="rounded-2xl bg-orange-500 px-8 py-4 text-xl font-black text-white shadow-lg transition hover:bg-orange-600"
          >
            Prihlásenie
          </button>
        )}
      </div>
    </header>
  );
}