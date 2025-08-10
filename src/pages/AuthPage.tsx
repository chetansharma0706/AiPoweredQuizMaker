import { GalleryVerticalEnd } from 'lucide-react';
import { Outlet } from 'react-router-dom';
import image from '../assets/illustration.png';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, logoutUser } from '../appwrite/auth';
import type { AppDispatch, RootState } from '../state/store';

export default function AuthPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, status } = useSelector((state: RootState) => state.auth);
  console.log(user);
  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/'); // send back to home or login
  };

  if (status === 'succeeded')
    return <p onClick={() => handleLogout()}>loginned</p>;

  return (
    <div className="grid min-h-svh lg:grid-cols-2 bg-purple-300">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            QuizMaker
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <Outlet />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block bg-[#DCC0FF]">
        <img
          src={image}
          alt="illustration"
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-100 dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
