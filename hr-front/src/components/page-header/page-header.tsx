type Props = {
  children: React.ReactNode;
};

export const PageHeader: React.FC<Props> = ({ children }) => {
  return (
    <h1 className="text-2xl font-semibold leading-none tracking-tight">
      {children}
    </h1>
  );
};
