import React, { FC } from "react";

interface IHeadMetaProps {
	title?: string;
	description?: string;
	keywords?: string;
}

const HeadMeta: FC<IHeadMetaProps> = ({ title, description, keywords }) => {
	return (
		<>
			<meta charSet="utf-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<meta name="description" content={description} />
			<meta name="keywords" content={keywords} />
			<meta name="author" content="DIMON ALOHA MISHA KKK" />
			<meta name="theme-color" content="#ffffff" />

			<link rel="icon" type="image/png" href="favicon.png" />

			<title>{title}</title>

			<link rel="stylesheet" href="css/Index.css" />
			<link
				rel="stylesheet"
				href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
			/>

			<link
				rel="preload"
				href="fonts/Vetrino/Vetrino.ttf"
				as="font"
				type="font/ttf"
				crossOrigin="anonymous"
			/>
			<link
				rel="preload"
				href="fonts/als-schlange-sans.ttf"
				as="font"
				type="font/ttf"
				crossOrigin="anonymous"
			/>
			<link
				rel="preload"
				href="fonts/Unbounded/Unbounded-Regular.ttf"
				as="font"
				type="font/ttf"
				crossOrigin="anonymous"
			/>
			<link
				rel="preload"
				href="fonts/Bounded/Bounded-Variable.ttf"
				as="font"
				type="font/ttf"
				crossOrigin="anonymous"
			/>
		</>
	);
};

export default HeadMeta;
