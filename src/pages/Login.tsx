
import { LoginForm } from '@/components/auth/LoginForm';

const Login = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white">SP CRM Leads</h1>
          <p className="mt-2 text-gray-400">Lead management simplified</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
