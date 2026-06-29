'use client';

import React from 'react';
import clsx from 'clsx';
import { motion, HTMLMotionProps } from 'framer-motion';
import './Button.css';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children?: React.ReactNode;
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  disabled,
  ...props
}: ButtonProps) {
  
  return (
    <motion.button
      whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      className={clsx('chessome-btn', `btn-${variant}`, `btn-${size}`, className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="loader-inline mr-2" />
      ) : null}
      {children}
    </motion.button>
  );
}
