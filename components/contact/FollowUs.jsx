import { Heart } from "lucide-react";
import SocialLinks from "@/components/layout/SocialLinks";

export default function FollowUs() {
  return (
    <div className="flex items-start gap-4">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-600 text-white">
        <Heart className="h-5 w-5" />
      </span>
      <div>
        <p className="text-lg font-bold text-gray-900">Follow Us</p>
        {/* If SocialLinks doesn't render circular icons by default,
            pass a variant/className prop or wrap each icon here */}
        <div className="mt-2">
          <SocialLinks />
        </div>
      </div>
    </div>
  );
}