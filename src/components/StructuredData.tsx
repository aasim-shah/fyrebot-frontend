import Script from 'next/script';

export function StructuredData() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'FyreBot',
    url: 'https://fyrebot.com',
    logo: 'https://fyrebot.com/logo.png',
    description: 'Deploy intelligent AI chatbots trained exclusively on your data',
    sameAs: [
      'https://twitter.com/fyrebot',
      'https://github.com/fyrebot',
      'https://linkedin.com/company/fyrebot',
    ],
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'FyreBot',
    url: 'https://fyrebot.com',
    description: 'AI Chatbot Platform - Deploy chatbots trained on your data',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://fyrebot.com/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'FyreBot',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '150',
    },
    featureList: [
      'AI-powered chatbot',
      'Custom data training',
      'No hallucinations',
      'Privacy-first',
      'Enterprise security',
      'npm package integration',
      'API access',
    ],
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://fyrebot.com',
      },
    ],
  };

  return (
    <>
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <Script
        id="software-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
