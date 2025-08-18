import { type JSX } from "react";
import { DiscordLogoIcon } from "@phosphor-icons/react";

interface DiscordInviteProps {
    inviteLink: string;
    label?: string;
    className?: string;
}

export function DiscordInviteLink({ inviteLink, label = "Join the Discord", className = "" }: DiscordInviteProps): JSX.Element {
    return (
        <a
            href={inviteLink}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors ${className}`}
        >
            <DiscordLogoIcon size={16} weight="fill" />
            <span>{label}</span>
        </a>
    );
};
