import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
const SimpleCard = ({
  title = "",
  description = "",
  children,
  className,
}: {
  title?: string;
  className?: string;
  description?: string | React.ReactNode;
  children: React.ReactNode;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className={className || "grid grid-cols-1 gap-5"}>
        {children}
      </CardContent>
    </Card>
  );
};

export default SimpleCard;
