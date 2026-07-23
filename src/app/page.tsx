import { portfolioData } from "@/data/portfolioData";
import ThemeWrapper from "@/components/shared/ThemeWrapper";

export default function PortfolioHome() {
  const data = portfolioData;
  const activeTheme = data.settings.selectedTheme || "apple";

  return (
    <>
      {/* Dynamic Fonts for Switchable Themes */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700;800;900&family=Lora:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Dynamic SEO Meta Headers */}
      <title>{data.settings.metaTitle || data.settings.websiteName}</title>
      <meta name="description" content={data.settings.metaDescription} />
      <meta name="theme-color" content={data.settings.themeColor} />

      {/* Google Analytics Script if Analytics ID is set */}
      {data.settings.analyticsId && (
        <>
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${data.settings.analyticsId}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${data.settings.analyticsId}');
              `,
            }}
          />
        </>
      )}

      {/* Custom injected CSS styles */}
      {data.settings.customCss && (
        <style dangerouslySetInnerHTML={{ __html: data.settings.customCss }} />
      )}

      {/* Custom injected Javascript code */}
      {data.settings.customJs && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              document.addEventListener('DOMContentLoaded', () => {
                try {
                  ${data.settings.customJs}
                } catch(e) {
                  console.error("Error executing custom JS override:", e);
                }
              });
            `,
          }}
        />
      )}

      {/* Render Main Content Theme Wrapper */}
      <main style={{ "--brand-color": data.settings.themeColor } as React.CSSProperties}>
        <ThemeWrapper data={data} initialTheme={activeTheme} />
      </main>
    </>
  );
}
