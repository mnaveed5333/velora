import "./globals.css";
import ReduxProvider from "@/store/ReduxProvider";
import ConditionalLayout from "@/components/layout/ConditionalLayout";

export const metadata = {
  title: "Velora | Clothing Store",
  description: "Timeless fashion for men, women, and kids.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="text-ink antialiased">
        <ReduxProvider>
          <ConditionalLayout>{children}</ConditionalLayout>
        </ReduxProvider>
      </body>
    </html>
  );
}