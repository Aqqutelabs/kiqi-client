"use client";

import { useEffect } from "react";

export default function JQueryClient() {
    useEffect(() => {
        import("jquery")
            .then(($) => {
                (window as any).$ = $;
                (window as any).jQuery = $;
                console.log("jQuery loaded");
            })
            .catch(err => console.error("Failed to load jQuery", err));
    }, []);

    return null;
}
