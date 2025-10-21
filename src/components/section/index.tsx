'use client';
import { FC, HTMLAttributes, useMemo } from 'react';
import clsx from 'clsx';

export type Variant =
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'quaternary'
    | 'quinary';

export type SectionProps = HTMLAttributes<HTMLElement> & {
    variant?: Variant;
    inset?: boolean;
};

const getClasses = (variant: Variant) => {
    if (variant === 'secondary') {
        return {
            container: 'bg-azure before:bg-azure after:bg-azure text-travertine',
        };
    }

    if (variant === 'tertiary') {
        return {
            container: 'bg-khaki before:bg-khaki after:bg-khaki text-black',
        };
    }

    if (variant === 'quaternary') {
        return {
            container: 'bg-white before:bg-white after:bg-white text-black',
        };
    }

    if (variant === 'quinary') {
        return {
            container: 'bg-concrete before:bg-concrete after:bg-concrete text-black',
        };
    }

    return {
        container: 'bg-salmon before:bg-salmon after:bg-salmon text-travertine',
    };
};

export const Section: FC<SectionProps> = ({
                                              variant = 'primary',
                                              inset = true,
                                              className,
                                              children,
                                              ...rest
                                          }) => {
    const { container } = useMemo(() => getClasses(variant), [variant]);
    return (
        <section
            className={clsx('section relative px-5 xl:px-32', className, container, {
                inset,
                ['before:content-[""] before:absolute before:z-10 before:left-0 before:bottom-full before:w-5 before:h-5 after:content-[""] after:absolute after:z-10 after:right-0 after:bottom-full after:w-5 after:h-5']:
                    !inset,
            })}
            {...rest}
        >
            <div className="max-w-7xl mx-auto">{children}</div>
        </section>
    );
};

export default Section;