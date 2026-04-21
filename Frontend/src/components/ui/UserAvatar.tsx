import { getInitials, stringToColor } from "@/utils/avatarUtils";

export interface UserAvatarProps {
  name?: string;
  avatarUrl?: string;
  className?: string;
  textClassName?: string;
}

export function UserAvatar({ name, avatarUrl, className = "w-10 h-10", textClassName }: UserAvatarProps) {
  const initials = getInitials(name);
  const bgColor = stringToColor(name);

  return (
    <div 
      className={`relative flex items-center justify-center rounded-full overflow-hidden shadow-sm shrink-0 ${className}`}
      style={{ backgroundColor: avatarUrl ? 'transparent' : bgColor }}
    >
      {avatarUrl ? (
        <img 
          src={avatarUrl} 
          alt={name || "User avatar"} 
          className="w-full h-full object-cover"
        />
      ) : (
        <span className={`text-white font-semibold drop-shadow-md ${textClassName ?? "text-sm"}`}>
          {initials}
        </span>
      )}
    </div>
  );
}
