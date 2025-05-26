import { SignUp } from '@clerk/nextjs';

const SignUpPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 pt-20">
            <SignUp />
        </div>
    );
};
export default SignUpPage;