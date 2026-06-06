import { Variants } from 'framer-motion';

export const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 40, rotateX: 8 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

export const fadeInVariant: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

export const slideFromLeft: Variants = {
  hidden: { opacity: 0, x: -60, rotateY: -8 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    x: 0,
    rotateY: 0,
    transition: { duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

export const slideFromRight: Variants = {
  hidden: { opacity: 0, x: 60, rotateY: 8 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    x: 0,
    rotateY: 0,
    transition: { duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};
