import { SiInstagram } from "react-icons/si";

export default function SocialLinks() {
  return (<a
    
      href="https://instagram.com"
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-wrap items-center justify-center gap-2 text-sm font-medium text-gray-900 transition-colors hover:text-red-600 sm:text-base"
    >
      <SiInstagram size={18} className="text-red-600" />
      <span className="font-bold">Follow us</span>
      <span className="font-normal text-gray-600">@VeloraStyle</span>
    </a>
  );
}