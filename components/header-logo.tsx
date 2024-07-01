import Link from "next/link";
import Image from "next/image";

export const HeaderLogo = () => {
  return (
    <Link href="/">
      <div className="items-center hidden lg:flex">
        <Image src="/logo.svg" width={28} height={28} alt="Logo" />
        <p className="font-semibold text-2xl text-white ml-2.5">
          Finance
        </p>
      </div>
    </Link>
  );
};
