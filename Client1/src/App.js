import './App.css';
import Layout from './Layout';
import CreatePost from './pages/CreatePost';
import IndexPage from './pages/IndexPage';
import LoginPage from './pages/LoginPage';
import PostPage from './pages/PostPage';
import RegisterPage from './pages/RegisterPage';
import {Route,Routes} from 'react-router-dom';
function App() {
  return (
<Routes>
<Route path="/" element={<Layout />} >
<Route index element={ <IndexPage />}/>
<Route path={'/login'} element={ <LoginPage />} />
<Route path={'/register'} element={<RegisterPage />} />
<Route path={'/create'} element={<CreatePost />} />
<Route path={'/post/:id'} element={<PostPage />} />
</Route>
      
    
</Routes>
    
   
  );
}

export default App;
