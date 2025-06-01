import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PublicLayout({ children }) {
  return (
    <div className="flex flex-column min-h-screen">
      <Navbar />
      <main className="flex-1 p-4">{children}</main>
      <Footer />
    </div>
  );
}
