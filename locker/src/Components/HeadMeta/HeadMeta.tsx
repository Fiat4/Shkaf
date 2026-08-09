import React, { FC } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';

const SITE_URL = 'https://lockerwood.ru';
const DEFAULT_TITLE = 'Locker Wood — мебель на заказ';
const DEFAULT_DESCRIPTION =
	'Кухни, шкафы, прихожие и другая мебель на заказ. Locker Wood — индивидуальный подход и качественные материалы.';
const DEFAULT_IMAGE = `${SITE_URL}/img/Logo.png`;
const DEFAULT_KEYWORDS =
	'мебель на заказ, кухни, шкафы, прихожие, стенки, Locker Wood, мебель из дерева';

export interface IHeadMetaProps {
	/** Short page title; brand suffix added unless fullTitle */
	title?: string;
	description?: string;
	keywords?: string;
	/** Absolute or path; defaults to current path on lockerwood.ru */
	canonical?: string;
	/** OG/Twitter image URL */
	image?: string;
	/** Use title as-is without "| Locker Wood" */
	fullTitle?: boolean;
	noindex?: boolean;
}

function resolveAbsoluteUrl(url: string): string {
	if (url.startsWith('http://') || url.startsWith('https://')) {
		return url;
	}
	if (url.startsWith('/')) {
		return `${SITE_URL}${url}`;
	}
	return `${SITE_URL}/${url}`;
}

const HeadMeta: FC<IHeadMetaProps> = ({
	title,
	description = DEFAULT_DESCRIPTION,
	keywords = DEFAULT_KEYWORDS,
	canonical,
	image,
	fullTitle = false,
	noindex = false,
}) => {
	const { pathname } = useLocation();
	const resolvedTitle = title
		? fullTitle
			? title
			: `${title} | Locker Wood`
		: DEFAULT_TITLE;
	const path = pathname === '/' ? '' : pathname.replace(/\/$/, '');
	const canonicalUrl = canonical
		? resolveAbsoluteUrl(canonical)
		: `${SITE_URL}${path}`;
	const imageUrl = resolveAbsoluteUrl(image || DEFAULT_IMAGE);

	return (
		<Helmet>
			<html lang="ru" />
			<title>{resolvedTitle}</title>
			<meta name="description" content={description} />
			<meta name="keywords" content={keywords} />
			<meta name="theme-color" content="#ffffff" />
			{noindex ? (
				<meta name="robots" content="noindex, nofollow" />
			) : (
				<meta name="robots" content="index, follow" />
			)}
			<link rel="canonical" href={canonicalUrl} />
			<link rel="icon" type="image/png" href="/img/Logo.png" />

			<meta property="og:type" content="website" />
			<meta property="og:locale" content="ru_RU" />
			<meta property="og:site_name" content="Locker Wood" />
			<meta property="og:title" content={resolvedTitle} />
			<meta property="og:description" content={description} />
			<meta property="og:url" content={canonicalUrl} />
			<meta property="og:image" content={imageUrl} />

			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:title" content={resolvedTitle} />
			<meta name="twitter:description" content={description} />
			<meta name="twitter:image" content={imageUrl} />
		</Helmet>
	);
};

export default HeadMeta;
