import type { JSX } from "react";
import { DiscordInviteLink } from "../atom/discordinvitelink";

export function Footer(): JSX.Element {
    return (
        <div className="fixed bottom-4 right-4 z-50 hidden md:block">
            <DiscordInviteLink inviteLink="https://discord.gg/jfhRyNSHvD" />
        </div>
    );
}
