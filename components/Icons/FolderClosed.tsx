import { SVGProps } from "react";

export const FolderClosed = ({
  className,
  ...props
}: SVGProps<SVGSVGElement>): JSX.Element => (
  <>
    <svg viewBox="0 0 512 512" className={className} {...props}>
      <path d="M448 480H64c-35.3 0-64-28.7-64-64V192H512V416c0 35.3-28.7 64-64 64zm64-320H0V96C0 60.7 28.7 32 64 32H181.5c17 0 33.3 6.7 45.3 18.7l26.5 26.5c12 12 28.3 18.7 45.3 18.7H448c35.3 0 64 28.7 64 64z" />
    </svg>
  </>
);
