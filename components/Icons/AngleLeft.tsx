import { SVGProps } from "react";

export const AngleLeft = ({
  className,
  ...props
}: SVGProps<SVGSVGElement>): JSX.Element => (
  <svg viewBox="0 0 320 512" className={className} {...props}>
    <path d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
  </svg>
);
