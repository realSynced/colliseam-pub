'use client'
import { useState, useEffect } from "react";
import { FastAverageColor } from "fast-average-color";



export default function BannerCard({ bannerUrl, avatarUrl }) {
    const fac = new FastAverageColor();
    const [bannerBackground, setBannerBackground] = useState(null);

    
    useEffect(() => {
        if (!bannerUrl) {
          fac.getColorAsync(avatarUrl).then((color) => {
            setBannerBackground(color.hex);
          });
        } else {
          setBannerBackground(`https://yerinlyysexrpzplasnt.supabase.co/storage/v1/object/public/banners/${bannerUrl}`);
        }
    }, [bannerUrl, avatarUrl]);
    return (
        <div
            style={{
                background: bannerBackground && bannerBackground.startsWith("http") ? `url(${bannerBackground})` : bannerBackground,
            }}
            className={`flex w-full h-72 rounded-b-2xl`}
        />
    )

}