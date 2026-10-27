import type { ReactNode } from "react";
type ContainerProps = {
  children: ReactNode;
};

export default function Container({ children }: ContainerProps) {
    return (
   <div className="w-full max-w-7xl mx-auto px-2">
      {children}
    </div>
    );
}