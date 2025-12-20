import { FC, useMemo } from 'react';
import Image, { ImageProps } from 'next/image';
import clsx from 'clsx';

export type Variant = 'primary' | 'secondary' | 'tertiary';
export type Size = 'medium' | 'large';

export type AvatarProps = {
    decorated?: boolean;
    srcSet?: string;
    size?: Size;
    variant?: Variant;
} & ImageProps;

const getClasses = (size: Size, variant: Variant) => {
    if (variant === 'secondary') {
        if (size === 'large') {
            return {
                image: 'w-20 h-20 xl:w-56 xl:h-56',
                container: 'p-4 xl:p-11',
                decoration:
                    'before:bg-azure after:bg-azure before:w-4 before:h-4 xl:before:w-11 xl:before:h-11 after:w-4 after:h-4 xl:after:w-11 xl:after:h-11',
            };
        }

        return {
            image: 'w-20 h-20 xl:w-36 xl:h-36',
            container: 'p-6',
            decoration:
                'before:bg-azure after:bg-azure before:w-6 before:h-6 after:w-6 after:h-6',
        };
    }

    if (variant === 'tertiary') {
        if (size === 'large') {
            return {
                image: 'w-20 h-20 xl:w-56 xl:h-56',
                container: 'p-4 xl:p-11',
                decoration:
                    'before:bg-salmon after:bg-salmon before:w-4 before:h-4 xl:before:w-11 xl:before:h-11 after:w-4 after:h-4 xl:after:w-11 xl:after:h-11',
            };
        }

        return {
            image: 'w-20 h-20 xl:w-28 xl:h-28',
            container: 'p-6',
            decoration:
                'before:bg-salmon after:bg-salmon before:w-6 before:h-6 after:w-6 after:h-6',
        };
    }

    if (size === 'large') {
        return {
            image: 'w-20 h-20 xl:w-56 xl:h-56',
            container: 'p-4 xl:p-11',
            decoration:
                'before:bg-khaki after:bg-khaki before:w-4 before:h-4 xl:before:w-11 xl:before:h-11 after:w-4 after:h-4 xl:after:w-11 xl:after:h-11',
        };
    }

    return {
        image: 'w-20 h-20 xl:w-28 xl:h-28',
        container: 'p-6',
        decoration:
            'before:bg-khaki after:bg-khaki before:w-6 before:h-6 after:w-6 after:h-6',
    };
};

const Avatar: FC<AvatarProps> = ({
                                            decorated,
                                            srcSet,
                                            size = 'medium',
                                            variant = 'primary',
                                            className,
                                            ...rest
                                        }) => {
    const { container, image, decoration } = useMemo(
        () => getClasses(size, variant),
        [size, variant]
    );

    return (
        <div className={clsx('inline-flex flex-col items-center', className)}>
            <div className={clsx('inline-flex', container)}>
                <div className={clsx('inline-flex relative bg-khaki', image)}>
                    <picture>
                        <source srcSet={srcSet} media="(min-width: 80rem)" />
                        <Image fill {...rest} className="object-cover" />
                    </picture>
                    {decorated ? (
                        <>
                            <i
                                className={clsx(
                                    decoration,
                                    'before:content-[""] before:absolute before:right-full before:bottom-full',
                                    'after:content-[""] after:absolute after:left-full after:bottom-full'
                                )}
                            />
                            <i
                                className={clsx(
                                    decoration,
                                    'before:content-[""] before:absolute before:right-full before:top-full',
                                    'after:content-[""] after:absolute after:left-full after:top-full'
                                )}
                            />
                        </>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default Avatar;