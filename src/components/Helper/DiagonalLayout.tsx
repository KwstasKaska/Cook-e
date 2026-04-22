import React from 'react';

export default function DiagonalLayout({
  children,
  whiteStart = '15%',
  bgColor = '#3F4756',
  fgColor = '#F3F4F6',
}: {
  children: React.ReactNode;
  whiteStart?: string;
  bgColor?: string;
  fgColor?: string;
}) {
  return (
    <div
      className="relative overflow-hidden min-h-screen"
      style={{ backgroundColor: bgColor }}
    >
      <div
        className="absolute bottom-0 left-0 w-full"
        style={{
          height: '78%',
          backgroundColor: fgColor,
          clipPath: `polygon(0 ${whiteStart}, 100% 0%, 100% 100%, 0% 100%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
