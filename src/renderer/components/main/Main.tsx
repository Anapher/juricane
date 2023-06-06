import Queue from '../queue/Queue';
import Footer from './Footer';
import Header from './Header';

export default function Main() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <Queue />
      <Footer />
    </div>
  );
}
