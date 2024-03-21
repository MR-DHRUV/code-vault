import "./globals.css";
import Navbar from "@/Components/Navbar";

export const metadata = {
    title: "CodeVault",
    description: "CodeValut is a platform to compile and run code online. It supports C++, Java, Python, and JavaScript. It also provides a feature to view all the submissions.",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossOrigin="anonymous" fetchPriority="true"></link>
            <body className="body">
                <div className="d-flex flex-column text-bg-light align-items-center">
                    <Navbar />
                </div>
                {children}
            </body>
        </html>
    );
}
