// components/metaTags.tsx
import React from 'react';

interface MetaTagsProps {
    title?: string;
    description?: string;
    imageUrl?: string;
    imageWidth?: string;
    imageHeight?: string;
    url?: string;
}

const MetaTags: React.FC<MetaTagsProps> = ({
    title = 'Vélos à Strasbourg',
    description = `Découvrez les graphiques heure par heure de 40 pistes cyclables. Suivez l évolution des données et analysez les tendances au fil du temps. Cliquez pour en savoir plus.`,
    imageWidth = '363',
    imageHeight = '269',
    url = 'https://strasbourgvelo.fr',
    imageUrl = `${url}/graphique_rs.png`,
}) => {
    return (
        <>
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={imageUrl} />
            <meta property="og:image:width" content={imageWidth} />
            <meta property="og:image:height" content={imageHeight} />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={url} />

            <meta name="twitter:title" content={title} />
            <meta name="twitter:url" content={url} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={imageUrl} />
            <meta name="twitter:card" content="summary_large_image" />
        </>
    );
};

export default MetaTags;
