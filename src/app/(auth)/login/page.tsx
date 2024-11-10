import type { NextPage } from "next";

import LoginForm from "../../_components/loginForm";

const Register: NextPage = async () => {
  return (
    <main className="h-dvh">
      <div className="h-dvh w-full">
        <div className="flex h-dvh items-center justify-center py-12">
          <LoginForm />
        </div>
      </div>
    </main>
  );
};

export default Register;
