import { useEffect } from 'react'; // already imported useState

export default function DashboardHome() {
  const router = useRouter();}
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [username, setUsername] = useState('');

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // ✅ Run only on the client
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUsername = sessionStorage.getItem('username');
      setUsername(storedUsername || 'Guest');
    }
  }, []);





















