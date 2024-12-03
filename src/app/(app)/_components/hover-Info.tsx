import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import React from "react";

const HoverInfo = ({
  children,
  button,
  className = "w-80",
  disabled = false,
}: {
  children: React.ReactNode;
  button: React.ReactNode;
  className?: string;
  disabled?: boolean;
}) => {
  return (
    <HoverCard open={disabled}>
      <HoverCardTrigger asChild>{button}</HoverCardTrigger>
      <HoverCardContent className={className}>{children}</HoverCardContent>
    </HoverCard>
  );
};

export default HoverInfo;
