import { SignIn } from '@clerk/nextjs';

const SignInPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 pt-10">
            <SignIn />
        </div>
    );
};
export default SignInPage;