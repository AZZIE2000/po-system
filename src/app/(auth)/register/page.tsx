import type { NextPage } from "next";
import RegisterForm from "../../_components/registerForm";
const Register: NextPage = async () => {
  return (
    <main className="h-dvh">
      <div className="h-dvh w-full">
        <div className="flex h-dvh items-center justify-center py-12">
          <RegisterForm />
        </div>
      </div>
    </main>
  );
};

export default Register;
