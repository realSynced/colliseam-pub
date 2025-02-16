'use client'
import { MdOutlineMarkEmailUnread } from "react-icons/md";
import { IoIosMailOpen } from "react-icons/io";
import Link from "next/link";

export default function EmailConfirmation({searchParams}) {

    const getEmailServiceUrl = (email) => {
        if (!email) return 'https://mail.google.com'; // Default to Gmail if no email is provided

        // Extract domain from the email (e.g., "gmail.com" from "user@gmail.com")
        const domain = email.split('@')[1]?.toLowerCase();

        // Map common email domains to their login/compose pages
        const emailServiceUrls = {
            'gmail.com': 'https://mail.google.com',
            'yahoo.com': 'https://mail.yahoo.com',
            'outlook.com': 'https://outlook.live.com',
            'hotmail.com': 'https://outlook.live.com',
            'icloud.com': 'https://www.icloud.com',
            'protonmail.com' : 'https://mail.protonmail.com',
        };

        // Return the corresponding email service URL or default to the email domain
        return emailServiceUrls[domain] || `https://${domain}`;
    };

    const email = searchParams.message;

    return (
        <div className="h-screen w-screen flex-col items-center justify-between">
            {/* <div className=""> */}
            {/* </div> */}
            <div className="h-full w-full flex flex-col space-y-12 items-center justify-center">
                <h1 className="font-bold text-3xl text-white">Check Your Email for the verification link!</h1>
                <MdOutlineMarkEmailUnread className="text-white font-medium text-9xl" />
                <Link
                    href={getEmailServiceUrl(email)}
                    className="bg-primary px-4 py-2 rounded-full font-bold text-sm text-white hover:bg-primaryHover"
                    aria-label="Open email client to send a message"
                >
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>Open Mail <IoIosMailOpen/></span>
                </Link>
            </div>
        </div>
    );
  }
  