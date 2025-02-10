import LoginForm from './_components/LoginForm';

export default function Home() {
  return (
    <div
      className="
      flex
      h-full
      min-h-full
      flex-col
      justify-center
      py-12
      sm:px-6
      lg:px-8
      bg-background
    "
    >
      <LoginForm />
    </div>
  );
}
