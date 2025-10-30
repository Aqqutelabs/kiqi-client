"use client";

import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { PageHeader } from "@/components/ui/layout/PageHeader";
import SimpleFileInput from "@/components/ui/SimpleFileInput";
import Heading from "@/components/ui/TextHeading";

export default function ProfilePage() {
  const integrations = [
    { platform: "Instagram", icon: "https://res.cloudinary.com/dygn4o3nv/image/upload/v1761811332/instagram-icon_wflhpf.svg" },
    { platform: "Facebook", icon: "https://res.cloudinary.com/dygn4o3nv/image/upload/v1761811332/facebook-icon_lbamci.svg" },
    { platform: "WhatsApp", icon: 'https://res.cloudinary.com/dygn4o3nv/image/upload/v1761811332/whatsapp-icon_jui8f6.svg' },
    { platform: "https://www.yourdomain.com", icon: "https://res.cloudinary.com/dygn4o3nv/image/upload/v1761811332/web-icon_fkl3hr.svg" },
  ];
  return (
      <main className="space-y-6">
        <PageHeader title="Profile" />
        {/* forms */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="col-span-2">
            <FormField
              id="email"
              name="orgName"
              label="Email Address"
              placeholder="Enter your email address"
            />
          </div>
          <FormField
            id="first-name"
            name="first-name"
            label="First Name"
            placeholder="Enter your first name"
          />
          <FormField
            id="last-name"
            name="last-name"
            label="Last Name"
            placeholder="Enter your last name"
          />
          <div className="col-span-2">
            <FormField
              id="email"
              name="email"
              label="Organization/Business Name"
              placeholder="Zini’s Ecommerce LTD"
              className="col-span-2"
            />
          </div>
        </div>

        {/* integrated accounts */}
        <div className="space-y-5">
          <Heading
            heading="Integrations"
            subtitle="Accounts you have connected"
          />
          {integrations.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center">
              <div className="flex justify-between items-center gap-4">
                <img src={item.icon} alt="Icon" className="size-6" />
                <p className="font-medium text-base text-[#606062]">{item.platform}</p>
              </div>
              <div className="flex gap-4 items-center">
                <Button>Change Account</Button>
                <Button variant={"tertiary"}>Visit</Button>
                <Button variant={"destructive"}>Delete</Button>
              </div>
            </div>
          ))}
        </div>

        {/* chatbot section */}
        <div className="space-y-5">
          <Heading
            heading="Chatbot"
            subtitle="This chatbot is linked to https://www.yourdomain.com"
          />
          <div className="flex justify-between items-center">
            <img src={"/zinibot.svg"} alt="Zini bot" />
             <div className="flex gap-4 items-center">
                <Button>Customize Chatbot</Button>
                <Button variant={"tertiary"}>Visit</Button>
                <Button variant={"destructive"}>Delete</Button>
              </div>
          </div>
        </div>
        <div className="flex justify-between items-end">
        <Heading
            heading="Profile"
            subtitle="Upload a picture"
          />
          <SimpleFileInput id="profile_picture" label=""/>
        </div>
      </main>
  );
}
