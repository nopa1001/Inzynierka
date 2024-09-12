type Props = {
  children: React.ReactNode;
};

export const PageDescription: React.FC<Props> = ({ children }) => {
  return <p className="text-sm text-muted-foreground">{children}</p>;
};
