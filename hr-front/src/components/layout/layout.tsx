import { Navbar } from "../navbar/navbar";

type Props = {
  children: React.ReactNode;
};

export const Layout: React.FC<Props> = ({ children }) => {
  return (
    <div className="flex flex-row">
      <div className="h-screen">
        <Navbar />
      </div>
      <main className="h-screen w-full">
        <div className="flex flex-col gap-8 h-screen ">{children}</div>
      </main>
    </div>
  );
};
