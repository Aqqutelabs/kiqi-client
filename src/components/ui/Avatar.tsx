
import Image from "next/image";
import Link from "next/link";

type AvatarProps = {
  src?: string;
  name?: string;
  href?: string;
};

function getInitials(fullName?: string) {
  if (!fullName) return "";

  const parts = fullName.trim().split(/\s+/); // split on spaces
  const first = parts[0]?.charAt(0).toUpperCase() || "";
  const second = parts[1]?.charAt(0).toUpperCase() || "";

  return first + second;
}


export default function Avatar({ src, name, href = "/user/profile" }: AvatarProps) {
  const initials = getInitials(name);

  return (
    <Link href={href}>
      {src ? (
        <div className="h-[30px] w-[30px] md:h-[40px] md:w-[40px] rounded-full overflow-hidden">
          <Image
            src={src}
            alt="Profile picture"
            width={40}
            height={40}
            className="w-full h-full object-cover rounded-full"
          />
        </div>
      ) : (
        <div
          className={`h-[30px] w-[30px] md:h-10 md:w-10 rounded-full flex justify-center items-center text-xs md:text-sm font-medium text-white bg-gray-400`}
        >
          <span>{initials}</span>
        </div>
      )}
    </Link>
  );
}