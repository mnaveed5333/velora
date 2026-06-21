import { Mail, Phone, MapPin } from "lucide-react";
import ContactInfoItem from "./ContactInfoItem";
import FollowUs from "./FollowUs";

export default function ContactInfoCard() {
  return (
    <div className="rounded-3xl bg-rose-50 p-8 md:p-10">
      <div className="flex flex-col gap-8">
        <ContactInfoItem icon={Mail} label="Email" value="contact@info.com" />
        <ContactInfoItem icon={Phone} label="Phone" value="929-242-6868" />
        <ContactInfoItem
          icon={MapPin}
          label="Address"
          value="123 Fifth Avenue, New York, NY 10160"
        />
        <FollowUs />
      </div>
    </div>
  );
}