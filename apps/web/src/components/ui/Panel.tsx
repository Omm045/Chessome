import React from 'react';
import clsx from 'clsx';
import { motion, HTMLMotionProps } from 'framer-motion';
import './Panel.css';

export interface PanelProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  variant?: 'default' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
}

export function Panel({
  className,
  variant = 'glass',
  padding = 'md',
  children,
  ...props
}: PanelProps) {
  
  const variantsDict = {
    default: 'panel-default',
    glass: 'glass-panel',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={clsx(
        variantsDict[variant],
        `padding-${padding}`,
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
